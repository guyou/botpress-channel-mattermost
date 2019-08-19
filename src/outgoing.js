const handlePromise = (event, next, promise) => {
  return promise
    .then(res => {
      console.log('WE ARE GOING NEXT PROMISE')
      next()
      event._resolve && event._resolve()
      return res
    })
    .catch(err => {
      console.log('THERE WAS AN ERROR')
      next(err)
      event._reject && event._reject(err)
      throw err
    })
}

const handleText = (event, next, mattermost) => {
  if (event.platform !== 'mattermost' || event.type !== 'text') {
    return next()
  }
  //console.log("HANDLE TEXT")
  const text = event.text
  const options = {}

  return handlePromise(event, next, mattermost.sendText(text, options, event))
}

const handleUpdateText = (event, next, mattermost) => {
  if (event.platform !== 'mattermost' || event.type !== 'update_text') {
    return next()
  }
  // TODO
}

const handleAttachments = (event, next, mattermost) => {
  if (event.platform !== 'mattermost' || event.type !== 'attachments') {
    return next()
  }
  // TODO
}

const handleUpdateAttachments = (event, next, mattermost) => {
  if (event.platform !== 'mattermost' || event.type !== 'update_attachments') {
    return next()
  }
  // TODO
}

const handleDeleteTextOrAttachments = (event, next, mattermost) => {
  if (event.platform !== 'mattermost' || event.type !== 'delete_text_or_attachments') {
    return next()
  }
  // TODO
}

const handleReaction = (event, next, mattermost) => {
  if (event.platform !== 'mattermost' || event.type !== 'reaction') {
    return next()
  }
  // TODO
}

const handleRemoveReaction = (event, next, mattermost) => {
  if (event.platform !== 'mattermost' || event.type !== 'remove_reaction') {
    return next()
  }
  // TODO
}

module.exports = {
  text: handleText,
  attachments: handleAttachments,
  reaction: handleReaction,
  update_text: handleUpdateText,
  update_attachments: handleUpdateAttachments,
  delete_text_or_attachments: handleDeleteTextOrAttachments,
  remove_reaction: handleRemoveReaction
}
