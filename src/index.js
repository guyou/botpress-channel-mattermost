import _ from "lodash";
import Promise from "bluebird";
import actions from "./actions";
import outgoing from "./outgoing";
import Mattermost from "./mattermost";
import UMM from "./umm";

let mattermost = null;

const outgoingMiddleware = async (event, next) => {
  if (event.platform !== "mattermost") {
    return next();
  }

  if (!outgoing[event.type]) {
    return next("Unsupported event type: " + event.type);
  }
  await outgoing[event.type](event, next, mattermost);
};

module.exports = {
  config: {
    MATTERMOST_USER: {
      type: "string",
      default: "",
      env: "MATTERMOST_USER"
    },
    MATTERMOST_PASSWORD: {
      type: "string",
      default: "",
      env: "MATTERMOST_PASSWORD"
    },
    MATTERMOST_HOST: {
      type: "string",
      default: "",
      env: "MATTERMOST_HOST"
    },
    MATTERMOST_USE_TLS: {
      type: "string",
      default: "",
      env: "MATTERMOST_USE_TLS"
    },
    MATTERMOST_TLS_VERIFY: {
      type: "string",
      default: "",
      env: "MATTERMOST_TLS_VERIFY"
    },
    MATTERMOST_GROUP: {
      type: "string",
      default: "",
      env: "MATTERMOST_GROUP"
    },
    scope: {
      type: "string",
      default: "admin,bot,chat:write:bot,commands,identify,incoming-webhook,channels:read",
      env: "MATTERMOST_SCOPE"
    }
  },

  init: async (bp, configurator, helpers) => {
    bp.middlewares.register({
      name: "mattermost.sendMessages",
      type: "outgoing",
      order: 100,
      handler: outgoingMiddleware,
      module: "botpress-channel-mattermost",
      description: "Sends messages to Mattermost"
    });

    bp.mattermost = {};
    _.forIn(actions, (action, name) => {
      bp.mattermost[name] = actions[name];
      const sendName = name.replace(/^create/, "send");
      bp.mattermost[sendName] = Promise.method(function() {
        const msg = action.apply(this, arguments);
        return bp.middlewares.sendOutgoing(msg);
      });
    });
    UMM(bp);
  },

  ready: async (bp, configurator, helpers) => {
    const config = await configurator.loadAll();

    rocketchat = new RocketChat(bp, config);
    await rocketchat.connect(bp);
    return rocketchat.listen(bp);
  }
};
