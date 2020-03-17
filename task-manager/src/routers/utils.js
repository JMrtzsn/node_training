
function containsUnknownItems(object, body) {
    const updates = Object.keys(body)
    const allowedUpdates = Object.keys(object.schema.tree)
    return !updates.every((update) => allowedUpdates.includes(update))
}

module.exports = containsUnknownItems