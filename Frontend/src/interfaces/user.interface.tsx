// ログインフォーム用ユーザー型
export interface ILoginUser {
  email: string;
  password: string;
}

// サインアップフォーム用ユーザー型
export interface IUser extends ILoginUser {
  name: string;
  confirm: string;
}
