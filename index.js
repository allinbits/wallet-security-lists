const context = JSON.parse(process.env.GITHUB_CONTEXT);
const submitter = context.actor;
const submissionDate = context.event.issue.created_at;

const template_fields = context.event.issue.body.split("### ").slice(1);
const addChainPR = (fields) => {
    const chainId = fields[1].split("\n\n")[1];
    const note = fields[2].split("\n\n").slice(1,-1);
    const threatLevel=fields[3].split("\n\n")[1][0];
    console.log( {chainId,note,threatLevel});
}
if (context.event.issue.title.startsWith("[Chain-add]: ")) {
    addChainPR(template_fields);
}
/*
if (context.event.issue.title.startsWith("[Site-add]: ")) {
    addSitePR(template_fields);
}
if (context.event.issue.title.startsWith("[Asset-add]: ")) {
    addAssetPR(template_fields);
}
*/