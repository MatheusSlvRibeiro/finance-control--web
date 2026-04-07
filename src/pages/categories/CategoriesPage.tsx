import { useMemo, useState } from 'react'
import { CategoriesList } from './_components/CategoriesList/CategoriesList'
import { useCategories } from '@hooks/useCategories'
import { CategoryType } from '@appTypes/category'
import { toast } from 'react-toastify'
import { PageHeader } from '@components/layout/PageHeader/PageHeader'
import { BaseModal } from '@components/ui/modal/baseModal/BaseModal'
import { FormModal } from '@components/ui/modal/formModal/FormModal'
import { DeleteModal } from '@components/ui/modal/deleteModal/DeleteModal'
import Button from '@components/ui/button/button'
import { Plus } from 'lucide-react'
import styles from './Categoriespage.module.scss'
import { CategoryForm } from './_components/CategoryForm/CategoryForm'
import { useCategoryModal } from './_hooks/useCategoryModal'
import { CategoryTypeTabs } from './_components/CategoryTypeTabs/CategoryTypeTabs'
import { categoryService } from '@services/category/categoryService'
import { ICON_OPTIONS } from '@services/category/categoryNormalizer'
import { parseApiError } from '@utils/parseApiError/parseApiError'

export type ModalType = 'create' | 'edit' | 'delete' | null

export default function CategoriesPage() {
	const { data: categories, loading, error, reload } = useCategories()
	const {
		isOpen: isModalOpen,
		modalType,
		selectedCategory,
		form,
		setForm,
		openCreate,
		openEdit,
		openDelete,
		close: closeModal,
	} = useCategoryModal()

	const handleSave = async () => {
		const payload = {
			name: form.name,
			category_type: form.type,
			category_color: form.colorKey,
			category_icon: form.iconKey,
		}

		try {
			if (modalType === 'create') {
				await categoryService.create(payload)
				toast('Categoria criada com sucesso!', { toastId: 'category-create-success' })
			} else if (modalType === 'edit' && selectedCategory) {
				await categoryService.update(selectedCategory.uuid, payload)
				toast('Categoria atualizada com sucesso!', { toastId: 'category-edit-success' })
			}
			await reload()
			closeModal()
		} catch (error) {
			toast(parseApiError(error, 'Erro ao salvar categoria. Tente novamente!'), {
				toastId: 'category-save-error',
			})
		}
	}

	const handleDelete = async () => {
		if (!selectedCategory) return
		try {
			await categoryService.delete(selectedCategory.uuid)
			toast('Categoria excluída com sucesso!', { toastId: 'category-delete-success' })
			await reload()
			closeModal()
		} catch (error) {
			toast(parseApiError(error, 'Erro ao excluir categoria. Tente novamente!'), {
				toastId: 'category-delete-error',
			})
		}
	}

	const [activeTab, setActiveTab] = useState<CategoryType>('income')

	const iconOptions = ICON_OPTIONS

	const filtered = useMemo(
		() => categories.filter((c) => c.type === activeTab),
		[categories, activeTab],
	)

	if (loading) {
		return <div className={styles.state}>Carregando categorias...</div>
	}

	if (error) {
		return (
			<div className={styles.state}>
				<p>Falha ao carregar: {error.message}</p>
				<Button variant="default" size="md" onClick={reload}>
					Tentar novamente
				</Button>
			</div>
		)
	}

	return (
		<div className={styles.categoriesPage}>
			<PageHeader title="Categorias" subtitle="Organize suas transações por categorias">
				<Button size="sm" variant="register" onClick={openCreate}>
					<Plus />
					Nova Categoria
				</Button>
			</PageHeader>

			<CategoryTypeTabs value={activeTab} onChange={setActiveTab} />

			<CategoriesList categories={filtered} onDelete={openDelete} onEdit={openEdit} />

			<BaseModal isOpen={isModalOpen} onClose={closeModal}>
				{(modalType === 'create' || (modalType === 'edit' && selectedCategory)) && (
					<FormModal
						title={modalType === 'create' ? 'Nova categoria' : 'Editar categoria'}
						message={
							modalType === 'create'
								? 'Crie uma nova categoria'
								: 'Atualize as informações da categoria'
						}
						closeModal={closeModal}
						handleSave={handleSave}
					>
						<CategoryForm value={form} onChange={setForm} iconOptions={iconOptions} />
					</FormModal>
				)}

				{modalType === 'delete' && selectedCategory && (
					<DeleteModal
						title="Excluir categoria"
						message={
							<>
								Tem certeza que deseja excluir a categoria{' '}
								<strong>{selectedCategory.name}</strong>
								?
								<br />
								Essa ação não pode ser desfeita.
							</>
						}
						closeModal={closeModal}
						deleteAction={handleDelete}
						deleteMessage="Categoria excluída com sucesso!"
					/>
				)}
			</BaseModal>
		</div>
	)
}
