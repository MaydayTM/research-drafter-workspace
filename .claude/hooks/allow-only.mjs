// .claude/hooks/allow-only.mjs van research-drafter-workspace (template: deploy/workspaces/drafter/ in research-engine-mcp).
// De PreToolUse-hook van de drafter-omgeving: laat alleen de vier research-drafter-tools door. Al het andere blokkeert met
// exit 2, en elke fout ook: onleesbare invoer hier, en via "onFailure": "block" een crash, een time-out of een ontbrekende
// node. Hangt niet af van welke tools de host aanbiedt. Geen import, geen omgeving, geen bestand: alleen stdin, een
// exitcode en een vaste melding. Exit 0 zonder uitvoer beslist niets; de allow- en deny-regels gelden daarna gewoon.
const ALLOWED = new Set([
  "mcp__research-drafter__research_snapshots",
  "mcp__research-drafter__research_snapshot_read",
  "mcp__research-drafter__research_submit_draft",
  "mcp__research-drafter__research_show",
]);

let name;
try {
  let raw = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) raw += chunk;
  name = JSON.parse(raw).tool_name;
} catch {
  name = undefined;
}
if (typeof name === "string" && ALLOWED.has(name)) process.exit(0);
process.stderr.write("Geweigerd: deze omgeving staat alleen de vier research-drafter-tools toe.\n");
process.exit(2);
