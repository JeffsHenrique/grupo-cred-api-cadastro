export class BadRequestError extends Error {
    constructor({ message }: { message: string }) {
        super(message || 'Bad request.')
    }
}