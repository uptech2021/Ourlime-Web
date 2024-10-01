import SwitchButton from '../SwitchButton';
import styles from './settings.module.css';
import { Input } from '@nextui-org/react';
export default function GeneralConfiguration() {
	return (
		<div className={styles.layout}>
			{/* Left Section */}
			<div className="left w-75">
				{/* General Configuration */}
				<div className="general-config mb-5 rounded-lg bg-white p-4">
					<h3 className="text-xl font-semibold">General Configuration</h3>

					{/* Maintenance Mode */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span className="rounded-lg bg-gray-300 px-3 py-1">
								Maintenance Mode
							</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							Turn the entire site under Maintenance.
						</p>
					</div>
				</div>

				{/* User Configuration */}
				<div className="user-config mb-5 rounded-lg bg-white p-4">
					<h3 className="text-xl font-semibold">User Configuration</h3>

					{/* User Last Seen Status */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span className="rounded-lg bg-gray-300 px-3 py-1">
								User Last Seen Status
							</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							Allow users to set their status, online & last active.
						</p>
					</div>
					<hr className="my-4" />

					{/* User Account Deletion */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span className="rounded-lg bg-gray-300 px-3 py-1">
								User Account Deletion
							</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							Allow users to delete their accounts.
						</p>
					</div>
					<hr className="my-4" />
				</div>

				{/* Other Settings */}
				<div className="other-config mb-5 flex flex-col gap-3 rounded-lg bg-white p-4">
					<h3 className="text-xl font-semibold">Other Settings</h3>

					{/* Censored Words */}
					<Input
						label="Censored Words"
						labelPlacement="outside"
						radius="sm"
						type="text"
					/>
					<p className="bottom mt-2 text-sm">
						Words to be censored and replaced with *** in messages, posts,
						comments etc, separated by a comma.
					</p>

					{/* Exchange rate API Key */}
					<Input
						label="Exchange rate API key"
						labelPlacement="outside"
						radius="sm"
						type="text"
					/>
					<p className="bottom mt-2 text-sm">
						Your Exchange rate API Key from here.
					</p>

					<hr className="my-4" />
				</div>
			</div>

			{/* Right Section */}
			<div className="right w-25">
				{/* Login & Registration */}
				<div className="general-config rounded-lg bg-white p-4">
					<h3 className="text-xl font-semibold">Login & Registration</h3>

					{/* User Registration */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span className="rounded-lg bg-gray-300 px-3 py-1">
								User Registration
							</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							Allow users to create accounts in your site.
						</p>
					</div>
					<hr className="my-4" />

					{/* Password Complexity System */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span className="rounded-lg bg-gray-300 px-3 py-1">
								Password Complexity System
							</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							The system will require a powerful password on sign up, including
							letters, numbers and special characters.
						</p>
					</div>
					<hr className="my-4" />

					{/* Unusual Login */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span className="rounded-lg bg-gray-300 px-3 py-1">
								Unusual Login
							</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							Send a confirmation link when the user logs in from a new
							location.
						</p>
					</div>
					<hr className="my-4" />

					{/* Remember This Device */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span className="rounded-lg bg-gray-300 px-3 py-1">
								Remember This Device
							</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							Remember this device on the welcome page.
						</p>
					</div>
					<hr className="my-4" />

					{/* Two-factor authentication */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span className="rounded-lg bg-gray-300 px-3 py-1">
								Two-factor authentication
							</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							Send confirmation code to email or SMS when user login.
						</p>
					</div>
					<hr className="my-4" />

					{/* reCaptcha */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span className="rounded-lg bg-gray-300 px-3 py-1">
								reCaptcha
							</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							Enable reCaptcha to prevent spam.
						</p>
					</div>
					<hr className="my-4" />

					{/* Recaptcha Key */}
					<div className="input-data">
						<Input
							label="Recaptcha Key"
							labelPlacement="outside"
							radius="sm"
							type="text"
						/>
					</div>

					{/* Recaptcha Secret Key */}
					<div className="input-data">
						<p className="sub-heading">Recaptcha Secret Key</p>
						<Input
							label="Recaptcha Secret Key"
							labelPlacement="outside"
							radius="sm"
							type="text"
						/>
					</div>

					<hr className="my-4" />

					{/* Prevent Bad Login Attempts */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span className="rounded-lg bg-gray-300 px-3 py-1">
								Prevent Bad Login Attempts
							</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							Enable this feature to track and stop brute-force attacks.
						</p>
					</div>

					{/* Login Limit */}
					<div className="input-data">
						<p className="sub-heading">Login Limit</p>
						<Input
							label="Login Limit"
							labelPlacement="outside"
							radius="sm"
							type="text"
						/>
						<p className="mt-2 text-sm">
							How many times a user can try to login before a lockout?
						</p>
					</div>

					{/* Lockout Time (In Minutes) */}
					<div className="input-data">
						<p className="sub-heading">Lockout Time (In Minutes)</p>
						<Input
							label="Lockout Time (In Minutes)"
							labelPlacement="outside"
							radius="sm"
							type="text"
						/>
						<p className="mt-2 text-sm">
							For how long should the user stay locked out?
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
