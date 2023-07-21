const operators: Array<string> = ['req.', 'res.', '.send', '.json', 'return'];
const mongooseCommands: Array<string> = ['show', 'aggregate', 'delete', 'distinct', 'find', 'insert', 'remove', 'delete', 'drop', 'update', 'save', 'create', 'get'];
export const detectionList: Array<string> = [...operators, ...mongooseCommands];