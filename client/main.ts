import { iterateReader } from "https://deno.land/std@0.178.0/streams/iterate_reader.ts";

type TunnelEndpoint = {host: string, port: number}

type StartTunnelParams = {
    remote: TunnelEndpoint,
    local: TunnelEndpoint,
    user: string,
}

const startTunnel = ({ remote, local, user }: StartTunnelParams) =>
  new Promise(async (resolve, reject) => {
    const command =
      `ssh -o StrictHostKeyChecking=no -NR ${remote.port}:${local.host}:${local.port} ${user}@${remote.host}`;
    console.log(`ℹ️ Using ssh command "${command}"`);
    const cmd = command.split(" ");
    const proc = Deno.run({ cmd, stdout: "piped", stderr: "piped" });
    if (remote.port != 0) resolve(remote.port);

    for await (const chunk of iterateReader(proc.stderr)) {
      const found = new TextDecoder().decode(chunk).toString().match(
        /Allocated port ([0-9]+) for remote/,
      );
      if (found) {
        const [, port] = found;
        if (port) {
          proc.stdout.close();
          resolve(port);
        }
      }
    }
  });
const parseEndpoint = (endpoint: string): TunnelEndpoint => {
  const [host, port] = endpoint.split(":");
  return { host, port: parseInt(port) };
};
const parseConfig = (args:string): StartTunnelParams => {
  const [user='root', rest] = args.split("@");
  const [remote, local] = rest.split("#");
  return { remote: parseEndpoint(remote), local: parseEndpoint(local), user };
};

const args = parseConfig(Deno.args[0]);
const assignedPort = await startTunnel(args);
console.log(
  `📜 started forwarding for ${args.remote.host}:${assignedPort} => localhost:${args.local.port}`,
);
console.log(`🔗 open in browser: `,`http://${args.remote.host}:${assignedPort}`)
