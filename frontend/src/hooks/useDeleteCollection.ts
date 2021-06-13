import { useEffect, useState } from "react"

const useDeleteCollection = () => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [rowsToDelete, setRowsToDelete] = useState<{
        lookup: { [dataIndex: number]: boolean };
        data: Array<{ index: number; dataIndex: number }>}>({lookup: {}, data: []});

    useEffect(() => {
        if (rowsToDelete.data.length) {
            setOpenDeleteDialog(true);
        }
    }, [rowsToDelete]);

    return {
        openDeleteDialog, setOpenDeleteDialog, rowsToDelete, setRowsToDelete
    }
}

export default useDeleteCollection;