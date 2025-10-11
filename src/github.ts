import * as core from "@actions/core";
import { context } from "@actions/github";

export interface FeishuVars {
  repo_name: string;
  event_type: string;
  event_type_display: string;
  action: string;
  actor: string;
  actor_url: string;
  ref_name: string;
  commit_sha: string;
  commit_message: string;
  html_url?: string;
  status?: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  header_color: string;
}

export function parseEventToTemplateData(): FeishuVars {
  const headerColorInput = core.getInput("header_color")
    ? core.getInput("header_color")
    : process.env.INPUT_HEADER_COLOR || "auto";

  const action = context.action;
  const actor = context.actor;
  const eventName = context.eventName;
  const repo = context.payload.repository?.name || "Unknown";
  const ref = context.ref.replace("refs/heads/", "");

  const payload = context.payload || {}
  console.log(payload)

  const vars: FeishuVars = {
    repo_name: repo,
    event_type: eventName,
    event_type_display: eventName.replace(/_/g, " ").toUpperCase(),
    action,
    actor,
    actor_url: `https://github.com/${actor}`,
    ref_name: ref,
    commit_sha: "",
    commit_message: "",
    html_url: "",
    status: "",
    title: "",
    description: "",
    created_at: "",
    updated_at: "",
    header_color: "grey",
  };

  // Event type
  // DOCS: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows
  switch (eventName) {
    case 'branch_protection_rule':
      break;
    case 'check_run':
      break
    case 'check_suite':
      break
    case 'create':
        vars.title = `Create ${context.payload.ref_type}`;
        vars.description = context.payload.ref_type === 'tag' ? context.payload.ref : context.payload.ref.replace('refs/heads/', '');
        vars.html_url = context.payload.repository?.html_url || ''
        vars.created_at = context.payload.created_at ?? '';
        vars.updated_at = context.payload.updated_at ?? '';
      break
    case 'delete':
        vars.title = `Delete ${context.payload.ref_type}`;
        vars.description = context.payload.ref_type === 'tag' ? context.payload.ref : context.payload.ref.replace('refs/heads/', '');
        vars.html_url = context.payload.repository?.html_url || ''
        vars.created_at = context.payload.created_at ?? '';
        vars.updated_at = context.payload.updated_at ?? '';
      break
    case 'deployment':
      break
    case 'deployment_status':
      break
    case 'discussion':
      break
    case 'discussion_comment':
      break
    case 'fork':
      break
    case 'gollum':
      break
    case "issue_comment":
      vars.title = context.payload.issue?.title ?? "";
      vars.description = `New comment on issue #${context.payload.issue?.number}`;
      vars.html_url = context.payload.comment?.html_url;
      vars.commit_message = context.payload.comment?.body ?? "";
      vars.created_at = context.payload.comment?.created_at ?? "";
      vars.header_color = "teal";
      break;
    case "issue":
      vars.title = context.payload.issue?.title ?? "";
      vars.description = `Issue #${context.payload.issue?.number} ${context.payload.action}`;
      vars.html_url = context.payload.issue?.html_url;
      vars.status = context.payload.action;
      vars.created_at = context.payload.issue?.created_at ?? "";
      vars.updated_at = context.payload.issue?.updated_at ?? "";
      vars.header_color = "blue";
      break;
    case 'label':
      break
    case 'merge_group':
      break
    case 'milestone':
      break
    case 'page_build':
      break
    case 'project':
      break
    case 'project_card':
      break
    case 'project_column':
      break
    case 'public':
      break
    case "pull_request":
      vars.title = context.payload.pull_request?.title ?? "";
      vars.description = `PR #${context.payload.pull_request?.number} ${context.payload.action}`;
      break;
    case 'pull_request_comment':
      vars.title = context.payload.pull_request?.title ?? "";
      vars.description = `PR #${context.payload.pull_request?.number} comment. action:${context.payload.action}, merged:${context.payload.pull_request?.merged}\n Branch: ${context.payload.pull_request?.base?.ref}<-${context.payload.pull_request?.head?.ref}`;
      break
    case 'pull_request_review':
      vars.title = context.payload.pull_request?.title ?? "";
      vars.description = `PR #${context.payload.pull_request?.number} request review. action:${context.payload.action}, merged:${context.payload.pull_request?.merged}\n Branch: ${context.payload.pull_request?.base?.ref}<-${context.payload.pull_request?.head?.ref}`;
      break
    case 'pull_request_review_comment':
      vars.title = context.payload.pull_request?.title ?? "";
      vars.description = `PR #${context.payload.pull_request?.number} review comment. action:${context.payload.action}, merged:${context.payload.pull_request?.merged}\n Branch: ${context.payload.pull_request?.base?.ref}<-${context.payload.pull_request?.head?.ref}`;
      break
    case 'pull_request_target':
      vars.title = context.payload.pull_request?.title ?? "";
      vars.description = `PR #${context.payload.pull_request?.number} action:${context.payload.action}, merged:${context.payload.pull_request?.merged}\n Branch: ${context.payload.pull_request?.base?.ref}<-${context.payload.pull_request?.head?.ref}`;
      vars.html_url = context.payload.pull_request?.html_url;
      vars.commit_sha = context.payload.pull_request?.head?.sha ?? "";
      vars.commit_message = context.payload.pull_request?.body ?? "";
      vars.status = context.payload.action;
      vars.created_at = context.payload.pull_request?.created_at ?? "";
      vars.updated_at = context.payload.pull_request?.updated_at ?? "";
      vars.header_color = context.payload.action === "closed" ? context.payload.pull_request?.merged ? "green" : "red" : "blue";
      break
    case "push":
      vars.commit_sha = context.payload.head_commit?.id ?? "";
      vars.commit_message = context.payload.head_commit?.message ?? "";
      vars.html_url = context.payload.compare;
      vars.title = `Push to ${context.payload.ref}`;
      vars.description = `${context.payload.commits?.length ?? 0} commits`;
      vars.created_at = context.payload.head_commit?.timestamp ?? "";
      vars.header_color = "green";
      break;
    case 'registry_package':
      break
    case "release":
      vars.title =
        context.payload.release?.name ??
        context.payload.release?.tag_name ??
        "";
      vars.description = context.payload.release?.body ?? "";
      vars.html_url = context.payload.release?.html_url;
      vars.created_at = context.payload.release?.created_at ?? "";
      vars.header_color = "purple";
      break;
    case 'repository_dispatch':
      break
    case "schedule":
      vars.title = "Scheduled job triggered";
      vars.description = "Triggered by cron";
      vars.header_color = "grey";
      break;
    case 'status':
      break
    case 'watch':
      vars.title = "Watch event triggered";
      vars.description = `Triggered by starring the repository`;
      vars.header_color = "orange";
      break
    case 'workflow_call':
      break
    case 'workflow_dispatch':
      break
    case 'workflow_run':
      vars.title =
        context.payload.workflow_run?.name ??
        context.payload.workflow?.name ??
        "";
      vars.status =
        context.payload.workflow_run?.conclusion ??
        context.payload.check_suite?.conclusion ??
        "";
      vars.html_url = context.payload.workflow_run?.html_url ?? "";
      vars.created_at = context.payload.workflow_run?.created_at ?? "";
      vars.updated_at = context.payload.workflow_run?.updated_at ?? "";
      vars.header_color =
        vars.status === "success"
          ? "green"
          : vars.status === "failure"
          ? "red"
          : "yellow";
      break;
    default:
      break
  }

  if (headerColorInput !== "auto") vars.header_color = headerColorInput;
  return vars;
}
