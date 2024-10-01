import { Input } from '@nextui-org/react';
import SwitchButton from '../SwitchButton';
import styles from './settings.module.css';

export default function SocialLogin() {
	return (
		<div className={styles.layout}>
			{/* Left Section */}
			<div className="left w-1/2">
				<div className="other-config rounded-lg bg-white p-4">
					<h3 className="mb-4 text-xl font-semibold">
						Upload & File Sharing Configuration
					</h3>

					{/* Facebook Login */}
					<div className="wrapper mb-4">
						<div className="top flex items-center justify-between">
							<span>Facebook Login</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							Enable the ability for users to login to your site using their
							Facebook account.
						</p>
					</div>

					{/* Google Login */}
					<div className="wrapper">
						<div className="top flex items-center justify-between">
							<span>Google Login</span>
							<SwitchButton />
						</div>
						<p className="bottom mt-2 text-sm">
							Enable the ability for users to login to your site using their
							Google+ account, (App requires reviewing)
						</p>
					</div>
				</div>
			</div>

			{/* Right Section */}
			<div className="right w-1/2">
				<div className="general-config rounded-lg bg-white p-4">
					<h3 className="mb-4 text-xl font-semibold">
						Setup Social Login API Keys
					</h3>

					{/* Facebook Configuration */}
					<div className="wrapper input-data mb-4 flex flex-col gap-3">
						<p className="sub-heading mb-2 w-1/2 rounded-lg bg-blue-600 px-4 py-2 text-white">
							Facebook Configuration
						</p>
						<Input radius="sm" type="text" placeholder="Application ID" />
						<Input
							radius="sm"
							type="text"
							placeholder="Application Secret Key"
						/>
					</div>

					{/* Google Configuration */}
					<div className="wrapper input-data flex flex-col gap-3">
						<p className="sub-heading mb-2 w-1/2 rounded-lg bg-red-600 px-4 py-2 text-white">
							Google Configuration
						</p>
						<Input radius="sm" type="text" placeholder="Client ID" />
						<Input radius="sm" type="text" placeholder="Client Secret Key" />
					</div>
				</div>
			</div>
		</div>
	);
}
