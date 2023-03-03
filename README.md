# ngpaper

## Preparation
- Setup a public vps with a ssh Server and GatewayPorts yes
- configure a wildcard domain like *.ngpaper.example.com to point to your vps on port 80/443

```
deno run -A client/main.ts root@test.ngpaper.danielrichter.codes:0#localhost:8080
```