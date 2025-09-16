import { App } from '@slack/bolt';
import dotenv from 'dotenv';

dotenv.config();

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// Event handlers
app.message(/hello/i, async ({ message, say }) => {
  await say({
    text: `Hello <@${message.user}>! I'm Peerbot 👋`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hello <@${message.user}>! I'm Peerbot 👋\n\nI can help you with:\n• Task management\n• Code reviews\n• Team collaboration`,
        },
      },
    ],
  });
});

// Slash commands
app.command('/peerbot', async ({ command, ack, respond }) => {
  await ack();

  await respond({
    text: 'Peerbot Menu',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Welcome to Peerbot!* 🤖\n\nChoose an action:',
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '📋 Create Task',
            },
            action_id: 'create_task',
            style: 'primary',
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '👀 View Tasks',
            },
            action_id: 'view_tasks',
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '❓ Help',
            },
            action_id: 'help',
          },
        ],
      },
    ],
  });
});

// Button interactions
app.action('create_task', async ({ ack, body, client }) => {
  await ack();

  await client.views.open({
    trigger_id: body.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'task_modal',
      title: {
        type: 'plain_text',
        text: 'Create New Task',
      },
      submit: {
        type: 'plain_text',
        text: 'Create',
      },
      blocks: [
        {
          type: 'input',
          block_id: 'task_title',
          label: {
            type: 'plain_text',
            text: 'Task Title',
          },
          element: {
            type: 'plain_text_input',
            action_id: 'title_input',
            placeholder: {
              type: 'plain_text',
              text: 'Enter task title',
            },
          },
        },
        {
          type: 'input',
          block_id: 'task_description',
          label: {
            type: 'plain_text',
            text: 'Description',
          },
          element: {
            type: 'plain_text_input',
            action_id: 'description_input',
            multiline: true,
            placeholder: {
              type: 'plain_text',
              text: 'Enter task description',
            },
          },
        },
      ],
    },
  });
});

// Modal submission handler
app.view('task_modal', async ({ ack, view, body, client }) => {
  await ack();

  const title = view.state.values.task_title.title_input.value;
  const description = view.state.values.task_description.description_input.value;

  await client.chat.postMessage({
    channel: body.user.id,
    text: `Task created: ${title}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `✅ *Task Created Successfully!*\n\n*Title:* ${title}\n*Description:* ${description}`,
        },
      },
    ],
  });
});