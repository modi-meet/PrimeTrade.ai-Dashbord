export interface IUser {
    _id: string;
    name: string;
    email: string;
    token?: string;
}

export interface ITask {
    _id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    user: string;
    createdAt: string;
    updatedAt: string;
}
