export class NotFoundError extends Error {
    constructor({ message }: { message: string }) {
        super(message || 'Not Found.')
    }
}