import { toast } from 'react-toastify'
import styles from './EditAccountModal.module.scss'
import { useEffect, useState } from 'react'
import { Select } from '@components/ui/select/Select'
import { Input } from '@components/ui/inputs/baseInput/input'
import { CurrencyInput } from '@components/ui/inputs/currencyInput/CurrencyInput'
import { FormModal } from '@components/ui/modal/formModal/FormModal'
import { ACCOUNT_TYPE_OPTIONS_ARRAY } from 'src/constants/accountTypes.constants'
import type { AccountType } from '@appTypes/account'
import { accountService } from '@services/accounts/accountService'

type EditAccountsModalProps = {
	closeModal: () => void
	uuid: string
	accountName: string | undefined
	openingBalance: number
	type: AccountType | undefined
	onSuccess: () => Promise<void>
}

export function EditAccountsModal({
	closeModal,
	uuid,
	accountName,
	openingBalance,
	type,
	onSuccess,
}: EditAccountsModalProps) {
	const [name, setName] = useState('')
	const [openingBalanceInCents, setOpeningBalanceInCents] = useState(0)
	const [accountType, setAccountType] = useState('')

	useEffect(() => {
		setName(accountName ?? '')
		setOpeningBalanceInCents(Math.round((openingBalance ?? 0) * 100))
		setAccountType(type ?? '')
	}, [accountName, openingBalance, type])

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
			await accountService.update(uuid, {
				name: name.trim(),
				opening_balance: openingBalanceInCents / 100,
				account_type: accountType,
			})
			toast('Conta atualizada com sucesso!', { toastId: 'success-edit' })
			await onSuccess()
			closeModal()
		} catch {
			toast('Erro ao atualizar conta. Tente novamente!', { toastId: 'error-edit-account' })
		}
	}

	return (
		<div className={styles.editAccountModal}>
			<FormModal
				title="Editar conta"
				message="Atualize as informações da sua conta"
				closeModal={closeModal}
				handleSave={handleSave}
			>
				<form className={styles.editAccountModal__form}>
					<Input
						id="name"
						name="name"
						label="Nome"
						placeholder={`${accountName}`}
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>

					<CurrencyInput
						id="openingBalance"
						name="openingBalance"
						label="Saldo inicial"
						placeholder={`${openingBalance}`}
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
				</form>
			</FormModal>
		</div>
	)
}
