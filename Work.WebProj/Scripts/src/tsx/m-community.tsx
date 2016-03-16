import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import Moment = require('moment');
import ReactBootstrap = require("react-bootstrap");
import CommCmpt = require('comm-cmpt');
import CommFunc = require('comm-func');

namespace Community {
    interface Rows {
        community_id?: number;
        check_del?: boolean,
        name?: string;

    }
    interface FormState {
        id: number | string,
        edit_type: IEditType
    }
    interface FormResult extends IResultBase {
        ID: string
    }
    interface GridProps {
        gridData: {
            rows?: Array<Rows>,
            page?: number,
            startcount?: number,
            endcount?: number,
            records?: number,
            total?: number
        },
        delCheck(i: number, chd: boolean): void,
        updateType(p1: IEditType): void,
        queryGridData(page: number): void,
        insertType(): void,
        deleteSubmit(): void,
        delItem(key: number | string): void,
        checkAll(): void
    }
    interface EditFormProps {
        edit_type: IEditType,
        noneType(): void,
        apiPath: string,
        updateType(id: number | string): void,
        id: number | string
    }
    interface EditFormState {
        fieldData: server.Community
    }
    interface QueryFormProps {
        updateType(id: number | string): void,
        insertType(): void,
        apiPath: string
    }
    interface QueryFormState {
        searchData?: any,
        checkAll?: boolean,
        gridData?: {
            rows?: Array<Rows>,
            page?: number,
            startcount?: number,
            endcount?: number,
            records?: number,
            total?: number
        }
    }
    export interface GridRowProps<R> {
        key: number,
        ikey: number,
        itemData: R,
        chd?: boolean,
        delCheck(p1: number, p2: boolean): void,
        delItem(key: number | string): void,
        updateType(p1: number | string): void,
        primKey: number
    }

    class QueryForm extends React.Component<QueryFormProps, QueryFormState>{

        constructor() {
            super();
            this.deleteSubmit = this.deleteSubmit.bind(this);
            this.delCheck = this.delCheck.bind(this);
            this.checkAll = this.checkAll.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.setInputValue = this.setInputValue.bind(this);
            this.handleSearch = this.handleSearch.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.deleteItemSubmit = this.deleteItemSubmit.bind(this);
            this.state = {
                gridData: {
                    rows: [], page: 1
                },
                searchData: []
            }
        }
        static defaultProps = {
        }

        componentDidMount() {
            this.queryGridData(1);
        }
        gridData(page: number) {

            var parms = {
                page: 0
            };

            if (page == 0) {
                parms.page = this.state.gridData.page;
            } else {
                parms.page = page;
            }

            $.extend(parms, this.state.searchData);
            return CommFunc.jqGet(this.props.apiPath, parms);
        }
        queryGridData(page: number) {
            this.gridData(page)
                .done((data, textStatus, jqXHRdata) => {
                    this.setState({ gridData: data });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        handleSearch(e: React.FormEvent) {
            e.preventDefault();
            this.queryGridData(0);
            return;
        }
        delCheck(i: number, chd: boolean) {
            let newState = this.state;
            this.state.gridData.rows[i].check_del = !chd;
            this.setState(newState);
        }
        checkAll(): void {

            let newState = this.state;
            newState.checkAll = !newState.checkAll;
            for (var prop in this.state.gridData.rows) {
                this.state.gridData.rows[prop].check_del = newState.checkAll;
            }
            this.setState(newState);
        }
        deleteSubmit() {

            if (!confirm('確定是否刪除?')) {
                return;
            }

            var ids = [];
            for (var i in this.state.gridData.rows) {
                if (this.state.gridData.rows[i].check_del) {
                    ids.push('ids=' + this.state.gridData.rows[i].community_id);
                }
            }

            if (ids.length == 0) {
                CommFunc.tosMessage(null, '未選擇刪除項', 2);
                return;
            }

            CommFunc.jqDelete(this.props.apiPath + '?' + ids.join('&'), {})
                .done(function (data, textStatus, jqXHRdata) {
                    if (data.result) {
                        CommFunc.tosMessage(null, '刪除完成', 1);
                        this.queryGridData(0);
                    } else {
                        alert(data.message);
                    }
                }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        deleteItemSubmit(key: string | number) {
            if (confirm('確定是否刪除此筆資料?')) {
                CommFunc.jqDelete(this.props.apiPath + '?id=' + key, {})
                    .done((data, textStatus, jqXHRdata) => {
                        if (data.result) {
                            CommFunc.tosMessage(null, '刪除完成', 1);
                            this.queryGridData(0);
                        } else {
                            alert(data.message);
                        }
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        CommFunc.showAjaxError(errorThrown);
                    });
            }
        }
        setInputValue(name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state['searchData'];

            if (input.value == 'true') {
                obj[name] = true;
            } else if (input.value == 'false') {
                obj[name] = false;
            } else {
                obj[name] = input.value;
            }
            this.setState({ searchData: obj });
        }
        render() {

            var searchData = this.state.searchData;

            return (
                <div>
                    <form onSubmit={this.handleSearch}>
                                <div className="table-responsive">
                                    <div className="table-header">
                                        <div className="table-filter">
                                            <div className="form-inline">
                                                <div className="form-group">
                                                    <label>使用者名稱</label> { }
                                                    <input type="text" className="form-control"
                                                        value={searchData.name}
                                                        onChange={this.setInputValue.bind(this, 'name') }
                                                        placeholder="請輸入關鍵字..." /> { }
                                                    <button className="btn-primary" type="submit"><i className="fa-search"></i> 搜尋</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                        </form>
                                                <Grid
                                                    gridData={this.state.gridData}
                                                    checkAll={this.checkAll}
                                                    delCheck={this.delCheck}
                                                    delItem={this.deleteItemSubmit}
                                                    updateType={this.props.updateType}
                                                    deleteSubmit={this.deleteSubmit}
                                                    insertType = {this.props.insertType}
                                                    queryGridData={this.queryGridData}
                                                    />
                    </div>);
        }
    }
    class GridRow extends React.Component<GridRowProps<Rows>, BaseDefine.GridRowStateBase> {
        constructor() {
            super();
            this.delCheck = this.delCheck.bind(this);
            this.modify = this.modify.bind(this);
        }
        static defaultProps = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPathName: gb_approot + 'api/Community'
        }
        delCheck(i, chd) {
            this.props.delCheck(i, chd);
        }

        modify() {
            this.props.updateType(this.props.primKey)
        }
        render() {

            return (
                <tr>

                       <td className="text-center">
                           <CommCmpt.GridButtonDel primKey={this.props.primKey} delItem={this.props.delItem} />
                           </td>
                       <td className="text-center">
                           <CommCmpt.GridButtonModify modify={this.modify} />
                           </td>
                       <td>
                           {this.props.itemData.name}
                           </td>
                    </tr>);

        }
    }
    class Grid extends React.Component<GridProps, any>{
        constructor() {
            super();
            this.state = {
            }
        }
        render() {

            let GridNavPage = CommCmpt.GridNavPage;

            return (
                <div>
                <table>
                                <thead>
                                    <tr>
                                        <th className="col-xs-1 text-center">
                                            <label className="cbox">
                                                <input type="checkbox" checked={this.state.checkAll} onChange={this.props.checkAll} />
                                                <i className="fa-check"></i>
                                                </label>
                                            </th>
                                        <th className="col-xs-1 text-center">修改</th>
                                        <th className="col-xs-10">社區名稱</th>
                                        </tr>
                                    </thead>
                                <tbody>
                                    {
                                    this.props.gridData.rows.map(
                                        (itemData, i) =>
                                            <GridRow key={i}
                                                ikey={i}
                                                primKey={itemData.community_id}
                                                itemData={itemData}
                                                delCheck={this.props.delCheck}
                                                delItem={this.props.delItem}
                                                updateType={this.props.updateType} />
                                    )
                                    }
                                    </tbody>
                    </table>
                <GridNavPage
                    startCount= { this.props.gridData.startcount }
                    endCount = { this.props.gridData.endcount }
                    recordCount = { this.props.gridData.records }
                    totalPage = { this.props.gridData.total }
                    nowPage = { this.props.gridData.page }
                    onQueryGridData = { this.props.queryGridData }
                    InsertType = { this.props.insertType }
                    deleteSubmit = { this.props.deleteSubmit }
                    />
                    </div>
            );
        }
    }
    class EditForm extends React.Component<EditFormProps, EditFormState>{

        constructor() {
            super();

            this.setInputValue = this.setInputValue.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.state = {
                fieldData: {}
            }
        }
        static defaultProps = {
        }

        componentDidMount() {
            if (this.props.edit_type == IEditType.update) {
                CommFunc.jqGet(this.props.apiPath, { id: this.props.id })
                    .done((data, textStatus, jqXHRdata) => {
                        this.setState({ fieldData: data.data });
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        CommFunc.showAjaxError(errorThrown);
                    });
            }
        }
        setInputValue(name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state.fieldData;

            if (input.value == 'true') {
                obj[name] = true;
            } else if (input.value == 'false') {
                obj[name] = false;
            } else {
                obj[name] = input.value;
            }
            this.setState({ fieldData: obj });
        }
        handleSubmit(e: React.FormEvent) {
            e.preventDefault();
            if (this.props.edit_type == IEditType.insert) {
                CommFunc.jqPost(this.props.apiPath, this.state.fieldData)
                    .done((data: FormResult, textStatus, jqXHRdata) => {
                        if (data.result) {
                            CommFunc.tosMessage(null, '新增完成', 1);
                            this.props.updateType(data.ID);
                        } else {
                            alert(data.message);
                        }
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        CommFunc.showAjaxError(errorThrown);
                    });
            }
            else if (this.props.edit_type == IEditType.update) {

                CommFunc.jqPut(this.props.apiPath, this.state.fieldData)
                    .done((data, textStatus, jqXHRdata) => {
                        if (data.result) {
                            CommFunc.tosMessage(null, '修改完成', 1);
                        } else {
                            alert(data.message);
                        }
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        CommFunc.showAjaxError(errorThrown);
                    });

            };

            return;
        }

        render() {
            let fieldData = this.state.fieldData;

            return (
                <form className="form-horizontal" onSubmit={this.handleSubmit}>
        <div className="col-xs-8">
            <div className="form-group">
                <label className="col-xs-2 control-label">中文名稱</label>
                <div className="col-xs-8">
                    <input type="text" className="form-control" onChange={this.setInputValue.bind(this, 'name') } value={fieldData.name} maxLength={50} required />
                    </div>
                <small className="col-xs-2 text-danger">(必填) </small>
                </div>


            <div className="form-action">
                <div className="col-xs-4 col-xs-offset-2">
                    <button type="submit" className="btn-primary"><i className="fa-check"></i> 儲存</button>
                    {}
                    <button type="button" onClick={this.props.noneType}><i className="fa-times"></i> 回前頁</button>
                    </div>
                </div>
            </div>
                    </form>
            );
        }
    }
    export class GridForm extends React.Component<BaseDefine.GridFormPropsBase, FormState>{
        constructor() {
            super();
            this.componentDidMount = this.componentDidMount.bind(this);
            this.noneType = this.noneType.bind(this);
            this.insertType = this.insertType.bind(this);
            this.updateType = this.updateType.bind(this);
            this.render = this.render.bind(this);

            this.state = {
                edit_type: IEditType.none,
                id: 0
            }
        }
        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/Community'
        }

        componentDidMount() {

        }

        insertType() {
            this.setState({ edit_type: 1, id: 0 });
        }
        updateType(id: number | string) {
            this.setState({ edit_type: 2, id: id });
        }
        noneType() {
            this.setState({ edit_type: 0, id: 0 });
            //this.gridData(0)
            //    .done(function (data, textStatus, jqXHRdata) {
            //        this.setState({ edit_type: 0, gridData: data });
            //    }.bind(this))
            //    .fail(function (jqXHR, textStatus, errorThrown) {
            //        CommFunc.showAjaxError(errorThrown);
            //    });
        }
        render() {
            var outHtml: JSX.Element = null;

            if (this.state.edit_type == IEditType.none) {
                outHtml =
                    (
                        <div>
                            <ul className="breadcrumb">
                                <li><i className="fa-list-alt"></i> {this.props.menuName}</li>
                                </ul>
                            <h3 className="title">
                                {this.props.caption}
                                </h3>
                            <QueryForm
                                insertType = {this.insertType}
                                updateType={this.updateType}
                                apiPath={this.props.apiPath}                                
                                />

                            </div>
                    );
            }
            else if (this.state.edit_type == IEditType.insert || this.state.edit_type == IEditType.update) {

                outHtml = (
                    <div>
    <ul className="breadcrumb">
        <li><i className="fa-list-alt"></i>
            {this.props.menuName}
            </li>
        </ul>
    <h4 className="title"> {this.props.caption} 基本資料維護</h4>
    <EditForm
        noneType={this.noneType}
        apiPath={this.props.apiPath}
        updateType={this.updateType}
        edit_type={this.state.edit_type}
        id={this.state.id}
        />
                        </div>
                );
            }

            return outHtml;
        }
    }
}

var dom = document.getElementById('page_content');
ReactDOM.render(<Community.GridForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);