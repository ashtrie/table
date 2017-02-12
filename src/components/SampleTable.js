import React from 'react';
import style from '../stylesheets/components/table.scss';

import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    filter: {
        input: {
            width: '120px',
            margin: '0 20px'
        }
    },
    header: {
        width: '202px'
    },
    add: {
        margin: '30px 0'
    }
};

export default class SampleTable extends React.Component {
    constructor() {
        super();

        let sorting = JSON.parse(localStorage.getItem('sorting'));
        let filtering = JSON.parse(localStorage.getItem('filtering'));
        let imported = JSON.parse(localStorage.getItem('import'));

        this.state = {
            table: {
                selectable: false,
                displaySelectAll: false,
                height: '300px',
                displayRowCheckbox: false
            },
            tableData: JSON.parse(localStorage.getItem('tableData')) || [],
            sorting: {
                id: sorting ? sorting.id : true,
                export: sorting ? sorting.export : false,
                name: sorting ? sorting.name : false,
                phone: sorting ? sorting.phone : false,
                email: sorting ? sorting.email : false
            },
            filtering: {
                idFrom: filtering ? filtering.idFrom : null,
                idTo: filtering ? filtering.idTo : null,
                name: filtering ? filtering.name : null,
                phone: filtering ? filtering.phone : null,
                email: filtering ? filtering.email : null
            },
            import: {
                data: imported ? imported.data : null,
                isValid: imported ? imported.isValid : true
            }
        };
    }

    saveToLocalStorage() {
        localStorage.setItem('tableData', JSON.stringify(this.state.tableData));
        localStorage.setItem('sorting', JSON.stringify(this.state.sorting));
        localStorage.setItem('filtering', JSON.stringify(this.state.filtering));
        localStorage.setItem('import', JSON.stringify(this.state.import));
        console.log('saved to local storage');
    }

    onCheckExport(index) {
        console.log('index ', index);
        let tableData = this.state.tableData;
        tableData[index].export = !tableData[index].export;
        this.setState(tableData);
        this.saveToLocalStorage();
    }

    onCangeTextField(index, field, event, newValue) {
        console.log('index ', index);
        console.log('field ', field);
        console.log('newValue ', newValue);
        let tableData = this.state.tableData;
        tableData[index][field] = newValue;
        this.setState(tableData);
        this.saveToLocalStorage();
    }

    onClickDelete(index) {
        console.log('index ', index);
        let tableData = this.state.tableData;
        let deletedId = tableData[index].id;

        tableData.splice(index, 1);
        tableData.forEach(item => {
            if (item.id > deletedId) {
                --item.id;
            }
        });
        this.setState(tableData);
        this.saveToLocalStorage();
    }

    onClickAdd() {
        console.log('add row');
        let tableData = this.state.tableData;
        tableData.push({ id: this.state.tableData.length + 1, name: '', phone: '', email: '', export: false });
        this.setState(tableData);
        this.saveToLocalStorage();
    }

    onClickSort(field) {
        console.log('sort by ', field);

        let tableData = this.state.tableData;
        let sorting = this.state.sorting;
        let fieldSort = sorting[field];

        sorting.id = false;
        sorting.export = false;
        sorting.name = false;
        sorting.phone = false;
        sorting.email = false;
        sorting[field] = !fieldSort;

        switch (field) {
            case 'export':
                tableData = tableData.sort(item => sorting[field] ? item.export : !item.export);
                break;
            case 'id':
            case 'name':
            case 'phone':
            case 'email':
                tableData = tableData.sort((a, b) => sorting[field] ? a[field] > b[field] : a[field] < b[field]);
                break;
        }
        this.setState(sorting);
        this.setState(tableData);
        this.saveToLocalStorage();
    }

    onChangeFilter(field, event, newValue) {
        console.log('filtering on ', field, ', ', newValue);
        let filtering = this.state.filtering;
        filtering[field] = newValue;
        this.setState(filtering);
        this.saveToLocalStorage();
    }

    filterCheck(index) {
        if (!this.state.filtering.idFrom &&
            !this.state.filtering.idTo &&
            !this.state.filtering.name &&
            !this.state.filtering.phone &&
            !this.state.filtering.email) {
            return true;
        }

        this.saveToLocalStorage();
        return this.idFromFilter(index) &&
               this.idToFilter(index) &&
               this.stringFilter(index, 'name') &&
               this.stringFilter(index, 'phone') &&
               this.stringFilter(index, 'email');
    }

    idFromFilter(index) {
        if (this.state.filtering.idFrom) {
            return this.state.tableData[index].id >= this.state.filtering.idFrom;
        }
        else {
            return true;
        }
    }

    idToFilter(index) {
        if (this.state.filtering.idTo) {
            return this.state.tableData[index].id <= this.state.filtering.idTo;
        }
        else {
            return true;
        }
    }

    stringFilter(index, field) {
        if (this.state.filtering[field]) {
            return this.state.tableData[index][field].toString().toLowerCase().includes(this.state.filtering[field].toLowerCase());
        }
        else {
            return true;
        }
    }

    onClickSetExport(isExpoerted) {
        let tableData = this.state.tableData;
        tableData.forEach(item => {
            item.export = isExpoerted;
        });
        this.setState(tableData);
        this.saveToLocalStorage();
    }

    onClickExport() {
        let tableData = this.state.tableData;
        let csvContent = "data:text/csv;charset=utf-8,";
        tableData.forEach(item => {
            if (item.export) {
                let dataString = item.name + ',' + item.phone + ',' + item.email + '\n';
                csvContent += dataString;
            }
        });

        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);

        let date = new Date();
        let fileName = 'export-table-data-' + date.toString() + '.csv'
        link.setAttribute('download', fileName);
        document.body.appendChild(link);

        link.click();
    }

    onClickImport() {
        console.log(this.isJsonString(this.state.import.data));
        let importJson = this.state.import;
        importJson.isValid = this.isJsonString(this.state.import.data);
        this.setState({ import: importJson});

        if (importJson.isValid) {
            let fromJson = JSON.parse(importJson.data);
            if (fromJson.name && fromJson.phone && fromJson.email) {
                console.log('imported!');

                let tableData = this.state.tableData;
                tableData.push({
                    id: this.state.tableData.length + 1,
                    name: fromJson.name,
                    phone: fromJson.phone,
                    email: fromJson.email,
                    export: false
                });
                this.setState(tableData);
                this.setState({
                    import: {
                        data: null,
                        isValid: true
                    }
                });
                this.saveToLocalStorage();
            }
            else {
                console.log('not imported!');
                importJson.isValid = false;
                this.setState({ import: importJson});
                this.saveToLocalStorage();
            }
        }

    }

    isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    onCangeImport(event, newValue) {
        console.log('import ', newValue);
        let importJson = this.state.import;
        importJson.data = newValue;
        this.setState({ import: importJson});
        this.saveToLocalStorage();
    }

    render() {
        const headerNames = ['id', 'export', 'name', 'phone', 'email'];
        const header = headerNames.map((item, index) => (
            <FlatButton
                key={ index }
                style={ styles.header }
                onClick={ ()=> this.onClickSort(item) }
            >
                { item.toUpperCase() }
                {
                    this.state.sorting[item] ?
                        <FontIcon className="material-icons" style={ { color: 'inherit', fontSize: '20px'} }>expand_more</FontIcon>
                    :
                        <FontIcon className="material-icons" style={ { color: 'inherit', fontSize: '20px'} }>expand_less</FontIcon>
                }
            </FlatButton>
        ));

        const filterNames = ['idFrom', 'idTo', 'name', 'phone', 'email'];
        const filter = filterNames.map((item, index) => (
            <TextField
                key={ index }
                floatingLabelText={ item }
                style={ styles.filter.input }
                onChange={ this.onChangeFilter.bind(this, item) }
                value={ this.state.filtering[item] ? this.state.filtering[item] : '' }
            />
        ));

        return (
            <section id="table">
                <div className="filter">
                    <h3>Filters</h3>
                    { filter }
                </div>

                <haeder>
                    { header }
                    <FlatButton disabled style={ styles.header } label="delete"/>
                </haeder>

                <Table
                    height={ this.state.table.height }
                    selectable={ this.state.table.selectable }
                >
                    <TableBody
                        displayRowCheckbox={ this.state.table.displayRowCheckbox }
                    >
                        {
                            this.state.tableData.map((row, index) => {
                                if (this.filterCheck(index)) {
                                    return (
                                        <TableRow key={ index }>
                                            <TableRowColumn>{ row.id }</TableRowColumn>
                                            <TableRowColumn>
                                                <Checkbox
                                                    checked={ row.export }
                                                    onCheck={ () => this.onCheckExport(index) }
                                                />
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <TextField hintText="empty" value={ row.name } onChange={ this.onCangeTextField.bind(this, index, 'name') }/>
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <TextField hintText="empty" value={ row.phone } onChange={ this.onCangeTextField.bind(this, index, 'phone') }/>
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <TextField hintText="empty" value={ row.email } onChange={ this.onCangeTextField.bind(this, index, 'email') }/>
                                            </TableRowColumn>
                                            <TableRowColumn>
                                                <IconButton onClick={ () => this.onClickDelete(index) }>
                                                    <FontIcon className="material-icons">clear</FontIcon>
                                                </IconButton>
                                            </TableRowColumn>
                                        </TableRow>
                                    );
                                }
                                else {
                                    return null;
                                }
                            })
                        }
                    </TableBody>
                </Table>

                <FloatingActionButton
                    mini={true}
                    onClick={ ::this.onClickAdd }
                    style={ styles.add }
                >
                    <FontIcon className="material-icons">add</FontIcon>
                </FloatingActionButton>

                <div className="export">
                    <h3>Export to CSV</h3>
                    <FlatButton
                        label="check all"
                        onClick={ () => this.onClickSetExport(true) }
                    />
                    <FlatButton
                        label="uncheck all"
                        onClick={ () => this.onClickSetExport(false) }
                    />
                    <FlatButton
                        primary={ true }
                        label="export"
                        onClick={ ::this.onClickExport }
                    />
                </div>

                <div className="import">
                    <h3>Import JSON</h3>
                    <TextField
                        hintText="write json here..."
                        multiLine={ true }
                        rows={ 4 }
                        rowsMax={ 6 }
                        onChange={ ::this.onCangeImport }
                        errorText={ this.state.import.isValid ? '' : 'invalid json'}
                        value={ this.state.import.data ? this.state.import.data : '' }
                    />
                    <FlatButton
                        primary={ true }
                        label="import"
                        onClick={ ::this.onClickImport }
                    />
                </div>

            </section>
        );
    }
}
