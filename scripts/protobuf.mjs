import {Command} from "commander";
import fs from "node:fs";
import path from "node:path";
import protobuf from "protobufjs";

const __dirname = import.meta.dirname;
const protoDir = path.join(__dirname, "/../src/proto/");
const messageDir = path.join(__dirname, "/../src/messages/");

const program = new Command()

program.command("json")
    .argument("filepath", "File where to look for type")
    .action(async (filepath, options) => {

        let root = new protobuf.Root();
        root.resolvePath = (origin, target) => {
            if (origin === "") {
                return path.join(protoDir, target);
            }

            const originPath = path.dirname(origin) + "/" + target;
            try {
                fs.lstatSync(originPath);
                return originPath;
            } catch {}

            return path.join(protoDir, target);
        };
        await root.load(filepath);

        const dest = path.join(messageDir, path.dirname(filepath), path.basename(filepath, ".proto") + ".json");

        fs.mkdirSync(path.dirname(dest), {recursive: true});
        fs.writeFileSync(dest, JSON.stringify(root.toJSON()));

        console.log("Writing ", dest);
    });

program.parse();
