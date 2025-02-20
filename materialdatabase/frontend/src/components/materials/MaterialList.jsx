import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { materialsApi } from '../../services/api';
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    TextField,
    Button
} from '@material-ui/core';

const MaterialList = () => {
    const [materials, setMaterials] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const intl = useIntl();

    useEffect(() => {
        fetchMaterials();
    }, [searchTerm]);

    const fetchMaterials = async () => {
        try {
            const response = await materialsApi.getAll({ search: searchTerm });
            setMaterials(response.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    };

    return (
        <div>
            <TextField
                fullWidth
                margin="normal"
                label={intl.formatMessage({ id: 'search.placeholder' })}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>{intl.formatMessage({ id: 'form.name' })}</TableCell>
                            <TableCell>{intl.formatMessage({ id: 'form.manufacturer' })}</TableCell>
                            <TableCell>{intl.formatMessage({ id: 'form.price' })}</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {materials.map((material) => (
                            <TableRow key={material.id}>
                                <TableCell>{material.id}</TableCell>
                                <TableCell>{material.name}</TableCell>
                                <TableCell>{material.manufacturer}</TableCell>
                                <TableCell>{material.price}</TableCell>
                                <TableCell>
                                    <Button color="primary">
                                        {intl.formatMessage({ id: 'button.edit' })}
                                    </Button>
                                    <Button color="secondary">
                                        {intl.formatMessage({ id: 'button.delete' })}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
};

export default MaterialList;