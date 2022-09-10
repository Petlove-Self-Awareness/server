export interface SignupData {
  name: string
  email: string
  password: string
}

export interface ISingupUseCase {
  add: (signupData: SignupData) => void
}
