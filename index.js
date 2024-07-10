var fs = require("fs");

const context = JSON.parse(process.env.GITHUB_CONTEXT);
const submitter = context.actor;
const submissionDate = context.event.issue.created_at;

const template_fields = context.event.issue.body.split("### ").slice(1);

const addChainPR = (fields) => {
  const chainId = fields[0].split("\n\n")[1].toLowerCase();
  const note = fields[1].split("\n\n").slice(1, -1).join("\r\n");
  const threatLevel = fields[2].split("\n\n")[1][0];
  const blacklist = JSON.parse(fs.readFileSync("chain-blacklist.json", "utf8"));
  const exists = blacklist.find((x) => x.chainId == chainId);
  if (exists >= 0) {
    blacklist[exists].userNotes.push({
      userName: submitter,
      userNote: note,
      noteDate: submissionDate,
    });
  } else {
    blacklist.push({
      chainId,
      submissionDate,
      threatLevel,
      userNotes: [
        {
          userName: submitter,
          userNote: note,
          noteDate: submissionDate,
        },
      ],
    });
  }
  fs.writeFileSync("chain-blacklist.json", JSON.stringify(blacklist, null, 2));
};

const addAssetPR = (fields) => {
  const baseDenom = fields[0].split("\n\n")[1].toLowerCase();
  const chainId = fields[1].split("\n\n")[1].toLowerCase();
  const note = fields[1].split("\n\n").slice(1, -1).join("\r\n");
  const threatLevel = fields[2].split("\n\n")[1][0];
  const blacklist = JSON.parse(fs.readFileSync("asset-blacklist.json", "utf8"));
  const denom_index = blacklist.find(
    (x) => x.baseDenom == denom && x.chainId == chainId
  );
  if (denom_index >= 0) {
    blacklist[denom_index].userNotes.push({
      userName: submitter,
      userNote: note,
      noteDate: submissionDate,
    });
  } else {
    blacklist.push({
      baseDenom,
      chainId,
      submissionDate,
      threatLevel,
      userNotes: [
        {
          userName: submitter,
          userNote: note,
          noteDate: submissionDate,
        },
      ],
    });
  }
  fs.writeFileSync("asset-blacklist.json", JSON.stringify(blacklist, null, 2));
};
const addSitePR = (fields) => {
  const urlObj = new URL(fields[0].split("\n\n")[1]);
  const url = (urlObj.host + urlObj.pathname).toLowerCase();
  const note = fields[1].split("\n\n").slice(1, -1).join("\r\n");
  const threatLevel = fields[2].split("\n\n")[1][0];
  const blacklist = JSON.parse(fs.readFileSync("site-blacklist.json", "utf8"));
  const exists = blacklist.find((x) => x.url == url);
  if (exists >= 0) {
    blacklist[exists].userNotes.push({
      userName: submitter,
      userNote: note,
      noteDate: submissionDate,
    });
  } else {
    blacklist.push({
      url,
      submissionDate,
      threatLevel,
      userNotes: [
        {
          userName: submitter,
          userNote: note,
          noteDate: submissionDate,
        },
      ],
    });
  }
  fs.writeFileSync("site-blacklist.json", JSON.stringify(blacklist, null, 2));
};
if (context.event.issue.title.startsWith("[Chain-add]: ")) {
  addChainPR(template_fields);
}

if (context.event.issue.title.startsWith("[Site-add]: ")) {
  addSitePR(template_fields);
}

if (context.event.issue.title.startsWith("[Asset-add]: ")) {
  addAssetPR(template_fields);
}
