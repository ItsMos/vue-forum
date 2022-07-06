import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
library.add(faPencilAlt)

export default (app) => {
  app.component('fa', FontAwesomeIcon)
}
