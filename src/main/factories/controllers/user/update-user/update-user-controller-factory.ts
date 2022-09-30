import { UpdateUserController } from '../../../../../presentation/controllers/user/update/update-user-controller'
import { IController } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-error-controller-decorator-factory'
import { makeDbUpdateUser } from '../../../usecases/user/update-user-usecase-factory'

export const makeUpdateUserController = (): IController => {
  return makeLogControllerDecorator(new UpdateUserController(makeDbUpdateUser()))
}
