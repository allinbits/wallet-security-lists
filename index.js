const context = JSON.parse(process.env.GITHUB_CONTEXT);
const submitter = context.actor;
const submissionDate = context.event.issue.created_at;

const template_fields = context.event.issue.body.split("### ");
console.log(template_fields);
