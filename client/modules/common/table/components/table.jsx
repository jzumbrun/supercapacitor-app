import React from 'react'
import { Component } from 'supercapacitor'
import _ from 'underscore'
import TableStore from 'modules/common/table/stores/table_store'
import TablePagination from 'modules/common/table/components/table_pagination.jsx'
import TableLimit from 'modules/common/table/components/table_limit.jsx'
import TableSearch from 'modules/common/table/components/table_search.jsx'

class Table extends Component {

    constructor(props) {
        super(props)

        this.start = 0
        this.limit = 10
        this.total = 0
        this.page = 1
        this.pages = 1
        this.filters = []
        this.search = ''
        this.sort_by = ''
        this.sort_direction = ''

        this.state = {
            total: 0,
            limit: this.limit,
            search: this.search,
            rows: [],
            page_info: 'no results',
            page: 1,
            pages: 1,
            show: false
        }

        this.event(TableStore, 'getData.success.' + this.props.id, this.onGetDataSuccess.bind(this))
        this.event(TableStore, 'refresh.' + this.props.id, this.onRefresh.bind(this))
    }

    componentDidMount() {
        super.componentDidMount()

        if(this.props.sort_by) {
            this.sort_by = this.props.sort_by
            this.sort_direction = this.props.sort_direction
        }

        this.loadSettings()
        this.getData()
    }

    onRefresh(){
        // Kill the state first WITHOUT a setState call
        // so the table does not flash in and out
        // But only if we do not have a unique key, aka key
        if(!this.props.key) this.state.rows = []
        this.getData()
    }

    loadSettings() {

        var key = this.props.id + '.table.settings'
        var settings_obj = localStorage.getItem(key)

        if(settings_obj) {
            try {
                settings_obj = JSON.parse(settings_obj)
            } catch(err) {
                settings_obj = {}
            }
        } else {
            settings_obj = {}
        }

        for(key in settings_obj) {
            this[key] = settings_obj[key]
        }
    }

    // save some things to local storage
    storeSettings() {
        var settings_obj = JSON.stringify({
            start: parseInt(this.start),
            limit: parseInt(this.limit),
            page: parseInt(this.page),
            search: this.search,
            sort_by: this.sort_by,
            sort_direction: this.sort_direction
        })

        var key = this.props.id + '.table.settings'

        localStorage.setItem(key, settings_obj)
    }

    getRequestParams() {
        return {
            columns: this.props.columns.map((col) => {
                // send only column key and title
                return {
                    data: col.data,
                    title: col.title
                }
            }),
            start: this.start,
            limit: this.limit,
            search: {
                value: this.search
            },
            sort_by: this.sort_by,
            sort_direction: this.sort_direction,
            filters: this.filters
        }
    }

    getData() {
        TableStore.getData(this.props.id, this.props.endpoint, this.getRequestParams())
    }

    onGetDataSuccess(data){
        this.total = parseInt(data.filtered)
        var index_first = this.start + 1
        var index_last = this.start + this.limit
        index_last = this.total < index_last ? this.total : index_last

        var page_info = index_first + '-' + index_last + ' of ' + this.total
        if(data.filtered == 0) {
            page_info = 'no results'
        }

        this.storeSettings()

        this.setState({
            rows: this.onData(data),
            total: data.filtered,
            limit: this.limit,
            search: this.search,
            sort_by: this.sort_by,
            sort_direction: this.sort_direction,
            page_info: page_info,
            page: this.page,
            pages: this.limit > 0 ? Math.ceil(this.total / this.limit) : 0,
            show: !this.props.show_empty && this.total === 0 ? false : true
        })
    }

    onData(data) {

        var callbacks = this.props.callbacks

        if (callbacks.onData && _.isFunction(callbacks.onData)) {
            data = callbacks.onData(data)
        }

        return data
    }

    handleLimitChange(e) {
        
        this.limit = parseInt(e.target.value)
        this.start = 0
        this.page = 1
        this.getData()
    }

    handleSearchChange(e) {
        this.search = e.target.value
        this.start = 0
        this.page = 1
        this.setState({search: this.search}, () => {
            this.getData()
        })

    }

    handlePageChange(e,direction) {
        var pages = this.limit > 0 ? Math.ceil(this.total / this.limit) : 0

        switch(direction) {
            case 'first':
                this.start = 0
                break
            case 'previous':
                this.start = this.start - this.limit
                break
            case 'next':
                this.start = this.start + this.limit
                break
            case 'last':
                this.start = (pages - 1) * this.limit
                break
        }

        if(this.start < 0) {
            this.start = 0
        }

        this.page = this.start > 0 ? ((this.start / this.limit) + 1) : 1

        this.getData()
    }

    handleSortChange(column_index) {

        if(this.sort_by == column_index) {
            this.sort_direction = this.sort_direction == '' ? '-' : ''
        } else {
            this.sort_by = parseInt(column_index)
            this.sort_direction = ''
        }

        this.getData()
    }

    handleQuickFilterChange(filter) {
        this.filters = [filter]
        this.getData()
    }

    dataCell(row, cell) {

        var data = row[cell.key]
        if(cell.cell_format) {
            data = cell.cell_format(row, data)
        }

        return (
            <td className={cell.className || ''} key={cell.key}>
                <div className="cell-title">{cell.title}</div>
                {cell.html ? <div dangerouslySetInnerHTML={{__html: data}}></div> : data }
            </td>
        )
    }

    tableRow(row, index) {
        var key = this.props.id + '-row-' + index
        // Allow for the key to be set from the data
        if(this.props.key && row[this.props.key]) key = row[this.props.key]

        // Allow for all rows to be their own components
        if(_.isFunction(this.props.row_format)) return this.props.row_format(key, row)

        return (
            <tr key={key} className={row.className || ''} >
                {this.props.columns.map((column, index) => {
                    return this.dataCell(row, column)
                })}
            </tr>
        )
    }

    headerCell(column, index) {

        var icon_name = 'sort', 
            sort_icon = null, 
            cursor = 'inherit', 
            onClick = false, 
            width = column.width || 100

        if(index == this.sort_by) {
            icon_name = (this.sort_direction == '') ? 'sort-by-attributes' : 'sort-by-attributes-alt'
        }

        if(column.sortable != false) {
            // if the column is sortable, make the header cell clickable
            sort_icon = (<span className={'pull-right ' + icon_name}></span>)
            cursor = 'pointer'
            onClick = this.handleSortChange.bind(this, index)
        }

        return (
            <th
                key={this.props.id + '-headerCell-' + index}
                onClick={onClick}
                className={column.headerCellClassName || ''}
                style={{
                    cursor: cursor,
                    whiteSpace: 'normal',
                    width: width
                }}
            >
                {column.title}
                {sort_icon}
            </th>
        )
    }

    table() {

        // by default show loading spinner
        var empty = (<div className="loading"></div>)

        if(_.isArray(this.state.rows) && this.state.rows.length == 0) {
            // if rows is an array and empty, we have no results
            empty = this.props.empty_results
        }

        return (
            <table
                id={this.props.id || ''}
                className={this.props.className || ''}
                style={{
                    width: '100%',
                    tableLayout: 'fixed'
                }}
            >
                {this.props.show_head &&
                    <thead>
                    <tr>
                        {this.props.columns.map(this.headerCell.bind(this))}
                    </tr>
                    </thead>
                }
                <tbody>
                    {_.isArray(this.state.rows) && this.state.rows.length > 0
                    ?
                        this.state.rows.map(this.tableRow.bind(this))
                    :
                        <tr><td colSpan={this.props.columns.length}>{this.props.empty_results}</td></tr>
                    }
                </tbody>
            </table>
        )
    }

    render() {

        if(this.state.show === false) return null

        // Search class needs to grow and shrink based on the existance of title and pagination
        var search_class_name = 'col-sm-12 '
        if(this.props.title && !this.props.show_pagination) search_class_name += 'col-md-12 col-lg-12'
        else if(this.props.title && this.props.show_pagination) search_class_name += 'col-md-9 col-lg-10'
        else search_class_name += 'col-md-6 col-lg-6'

        return (
            <div className="table-component col-md-12 margin-bottom-sm">
                <div className="row flex">
                    
                    { this.props.title &&
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <h2 className="title inline">{this.props.title}</h2>
                        </div>
                    }
                
                    <div className={this.props.title ? 'col-sm-12 col-md-6 col-lg-6' : 'col-lg-12'} >
                        {this.props.show_search && 
                            <div className={search_class_name} >
                                <div className="row">
                                    <TableSearch
                                        search_placeholder={this.props.search_placeholder}
                                        search={this.state.search}
                                        onSearchChange={this.handleSearchChange.bind(this)}
                                    />
                                    
                                </div>
                            </div>
                        }
                        { this.props.show_pagination &&
                            <div className="pull-right hide-for-small-only">
                                <TableLimit
                                    onLimitChange={this.handleLimitChange.bind(this)}
                                    limit={this.state.limit}
                                />
                            </div>
                        }
                    </div>
                </div>

                {this.table()}
                { this.props.show_pagination && this.state.total > this.state.limit &&
                    <TablePagination
                        pageInfo={this.state.page_info}
                        onPageChange={this.handlePageChange.bind(this)}
                        page={this.state.page}
                        pages={this.state.pages}
                        limit={this.state.limit}
                    />
                }

                { this.props.show_pagination &&
                    <div className="col-md-6 col-lg-6 text-center show-for-small-only">
                        <TableLimit
                            onLimitChange={this.handleLimitChange.bind(this)}
                            limit={this.state.limit}
                        />
                    </div>
                }

            </div>
        )
    }
}

Table.defaultProps = {
    id: '',
    endpoint: '',
    empty_results: 'No results found',
    columns: [],
    callbacks: {},
    sort_by: '',
    sort_direction: '',
    width: '',
    title: '',
    show_head: true,
    show_pagination: true,
    show_search: true,
    show_empty: true,
    search_placeholder: 'Search',
    row_format: null
}

export default Table
