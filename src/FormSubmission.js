import { cloneDeep } from './libs/utils'
import FileUpload from './FileUpload'

export default class FormSubmission {
  /**
   * Initialize a formulate form.
   * @param {vm} form an instance of FormulateForm
   */
  constructor (form) {
    this.form = form
  }

  /**
   * Determine if the form has any validation errors.
   *
   * @return {Promise} resolves a boolean
   */
  hasValidationErrors () {
    return this.form.hasValidationErrors()
  }

  /**
   * Asynchronously generate the values payload of this form.
   * @return {Promise} resolves to json
   */
  values () {
    return new Promise((resolve, reject) => {
      const pending = []
      const values = cloneDeep(this.form.internalFormModelProxy)
      for (const key in values) {
        if (typeof this.form.internalFormModelProxy[key] === 'object' && this.form.internalFormModelProxy[key] instanceof FileUpload) {
          pending.push(this.form.internalFormModelProxy[key].upload())
        }
      }
      /**
       * @todo - how do we get these uploaded path values back into our data?
       */
      Promise.all(pending)
        // .then(file => file.path)
        .then(() => resolve(values))
        .catch(err => reject(err))
    })
  }
}
