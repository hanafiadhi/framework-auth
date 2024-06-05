export interface IUpdateTfaUser {
  _id: string;
  tfaSecrect: string;
  isTfaEnable: boolean;
  tfaToken: string;
}
