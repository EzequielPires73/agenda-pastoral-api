import {messaging} from 'firebase-admin';

export class FirebaseService {
    constructor() {}

    async sendMessaging({body, title, token, route}: {token: string, title: string, body: string, route?: string}) {
        try {
            const res = await messaging().send({
                token,
                notification: {
                    title: title,
                    body: body
                },
                data: {
                    route
                }
            });
            
            return {
                success: true,
                message: 'Notificação enviada com sucesso.'
            }
        } catch (error) {
            console.log(error.message);
            return {
                success: false,
                message: 'Notificação não foi enviada com sucesso, tente novamente.'
            }
        }
    }
}