import { ChangePasswordForm } from './ChangePasswordForm'
import { DeleteAccount } from './DeleteAccount'

export function UserSecurity() {
	return (
		<>
			<ChangePasswordForm />
			<hr className="border-border/70 border-t-2" />
			<DeleteAccount />
		</>
	)
}
