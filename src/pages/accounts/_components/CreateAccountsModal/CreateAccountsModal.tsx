import { toast } from 'react-toastify'
import { ReactElement, useState } from 'react'
import { Select } from '@components/ui/select/Select'
import { Input } from '@components/ui/inputs/baseInput/input'
import { CurrencyInput } from '@components/ui/inputs/currencyInput/CurrencyInput'
import styles from './CreateAccounts.module.scss'
import { FormModal } from '@components/ui/modal/formModal/FormModal'
import { ACCOUNT_TYPE_OPTIONS_ARRAY } from 'src/constants/accountTypes.constants'
import { accountService } from '@services/accounts/accountService'

type CreateAccountsModalProps = {
	closeModal: () => void
	onSuccess: () => Promise<void>
}

export function CreateAccountsModal({ closeModal, onSuccess }: CreateAccountsModalProps): ReactElement {
	const [name, setName] = useState('')
	const [openingBalanceInCents, setOpeningBalanceInCents] = useState(0)
	const [accountType, setAccountType] = useState('')

	const handleSave = async () => {
		if (!name.trim()) {
			toast('Nome da conta é obrigatório!', { toastId: 'error-name-account' })
			return
		}

		if (!accountType) {
			toast('Selecione o tipo de conta!', { toastId: 'error-type-account' })
			return
		}

		try {
			await accountService.create({
				name: name.trim(),
				opening_balance: openingBalanceInCents / 100,
				account_type: accountType,
			})
			toast('Conta criada com sucesso!', { toastId: 'success-create-account' })
			await onSuccess()
			closeModal()
		} catch {
			toast('Erro ao criar conta. Tente novamente!', { toastId: 'error-create-account' })
		}
	}

	return (
		<div className={styles.createAccount}>
			<FormModal
				title="Nova conta"
				message="Cadastre as informações da sua conta"
				closeModal={closeModal}
				handleSave={handleSave}
			>
				<div className={styles.createAccount__form}>
					<Input
						id="name"
						name="name"
						label="Nome"
						placeholder="Nome"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>

					<CurrencyInput
						id="openingBalance"
						name="openingBalance"
						label="Saldo inicial"
						valueInCents={openingBalanceInCents}
						onChangeInCents={setOpeningBalanceInCents}
					/>

					<Select
						id="accountType"
						name="accountType"
						label="Tipo de conta"
						options={ACCOUNT_TYPE_OPTIONS_ARRAY}
						value={accountType}
						onChange={setAccountType}
						placeholder="Selecione o tipo de conta"
					/>
				</div>
			</FormModal>
		</div>
	)
}
