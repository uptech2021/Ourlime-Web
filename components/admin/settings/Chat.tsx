import SwitchButton from '../SwitchButton';
import styles from './settings.module.css';
import { Input } from '@nextui-org/react';

export default function Chat() {
	return (
		<div className={styles.layout}>
			<div className="flex flex-row justify-between">
				{/* Left Section */}
				<div className="left w-47">
					{/* Twilio API Configuration */}
					<div className="other-config mb-5 flex flex-col gap-3 rounded-lg bg-white p-4">
						<h3 className="text-xl font-semibold">Twilio API Configuration</h3>

						<div className="wrapper">
							<div className="top mt-4 flex items-center justify-between">
								<span className="rounded-lg bg-gray-300 px-3 py-1">
									Twilio Video / Audio Calls
								</span>
								<SwitchButton />
							</div>
							<p className="bottom mt-2 text-sm">
								Enable Twilio to start video chat service in your website.
							</p>
						</div>

						<hr className="my-4" />

						<div className="wrapper input-data">
							<Input
								label="Live accountSid"
								labelPlacement="outside"
								radius="sm"
								type="text"
								placeholder="Enter Live accountSid"
							/>
						</div>

						<div className="wrapper input-data">
							<Input
								label="apiKeySid"
								labelPlacement="outside"
								radius="sm"
								type="password"
								placeholder="********"
							/>
						</div>
					</div>
				</div>

				{/* Right Section (assuming empty based on your structure) */}
				<div className="right w-47"></div>
			</div>
		</div>
	);
}
