import { markRaw, Raw, ref, Ref } from 'vue';
import SuccessFlashMessage from '@/components/banners/flash-messages/success-flash-message.vue'
import ErrorFlashMessage from '@/components/banners/flash-messages/error-flash-message.vue'

type FlashComponent = typeof SuccessFlashMessage | typeof ErrorFlashMessage

export default class FlashMessagesService {
    private static instance: FlashMessagesService
    message: Ref<Array<{component: Raw<FlashComponent>; message: string}>> = ref([])
    TIMEOUT = 4000

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance(): FlashMessagesService {
        if (!FlashMessagesService.instance) {
            FlashMessagesService.instance = new FlashMessagesService()
        }
        return FlashMessagesService.instance
    }

    public success(msg = 'Succès'): void {
        const component = markRaw<typeof SuccessFlashMessage>(SuccessFlashMessage)
        this.message.value.push({
            component,
            message: msg
        })
        setTimeout(() => {
            this.message.value.shift()
        }, this.TIMEOUT)
    }

    public error(msg = 'Erreur'): void {
        const component = markRaw<typeof ErrorFlashMessage>(ErrorFlashMessage)
        this.message.value.push({
            component,
            message: msg
        })
        setTimeout(() => {
            this.message.value.shift()
        }, this.TIMEOUT)
    }

}
