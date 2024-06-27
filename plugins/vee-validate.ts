import { defineRule, configure } from 'vee-validate'
import { required, email, min } from '@vee-validate/rules'
export default defineNuxtPlugin(() => {
    defineRule('required', required)
    defineRule('email', email)
    defineRule('min', min)

    configure({
        generateMessage: (ctx) => {
            const messages = {
                required: `The field ${ctx.field} is required.`,
                email: `The field ${ctx.field} must be a valid email.`,
                min: `The field ${ctx.field} must be at least ${ctx.rule?.params[0]} characters.`,
            }

            return messages[ctx.rule?.name] || `The field ${ctx.field} is invalid.`
        },
    })
})
