interface EmailTemplateProps {
  username: string;
  verifyCode: string
}

export const EmailTemplate = ({username, verifyCode}:EmailTemplateProps) => (
   <div>
    <h1>Hello , {username}</h1>
    <p>Your verification code is : {verifyCode}</p>
  </div>
)

export default EmailTemplate

