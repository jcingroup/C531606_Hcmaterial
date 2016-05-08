import $ = require('jquery');
import React = require('react');
import ReactDOM = require('react-dom');
import Moment = require('moment');
import ReactBootstrap = require("react-bootstrap");
import update = require('react-addons-update');
import CommCmpt = require('comm-cmpt');
import CommFunc = require('comm-func');
import dt = require('dt');
import DatePicker = require('react-datepicker');
import "react-datepicker/dist/react-datepicker.css";

namespace News {
    interface Rows {
        news_id?: string;
        check_del?: boolean,
        news_title?: string;
        set_date?: string;
        state?: string;
        i_Lang?: string;
    }
    interface FormState<G, F> extends BaseDefine.GirdFormStateBase<G, F> {
        searchData?: {
            keyword: string
        }
    }
    interface FormResult extends IResultBase {
        id: string
    }

    class GridRow extends React.Component<BaseDefine.GridRowPropsBase<Rows>, BaseDefine.GridRowStateBase> {
        constructor() {
            super();
            this.delCheck = this.delCheck.bind(this);
            this.modify = this.modify.bind(this);
        }
        static defaultProps = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPathName: gb_approot + 'api/News'
        }
        delCheck(i, chd) {
            this.props.delCheck(i, chd);
        }
        modify() {
            this.props.updateType(this.props.primKey)
        }
        render() {

            return <tr>
                <td className="text-center"><CommCmpt.GridCheckDel iKey={this.props.ikey} chd={this.props.itemData.check_del} delCheck={this.delCheck} /></td>
                <td className="text-center"><CommCmpt.GridButtonModify modify={this.modify} /></td>
                <td>{this.props.itemData.news_title}</td>
                <td>{Moment(this.props.itemData.set_date).format(dt.dateFT) }</td>
                <td>{this.props.itemData.i_Lang}</td>
                <td>{this.props.itemData.state == 'A' ? <span className="label label-primary">顯示</span> : <span className="label label-default">隱藏</span>}</td>
            </tr>;

        }
    }
    export class GridForm extends React.Component<BaseDefine.GridFormPropsBase, FormState<Rows, server.News>>{

        constructor() {

            super();
            this.updateType = this.updateType.bind(this);
            this.noneType = this.noneType.bind(this);
            this.queryGridData = this.queryGridData.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.deleteSubmit = this.deleteSubmit.bind(this);
            this.delCheck = this.delCheck.bind(this);
            this.checkAll = this.checkAll.bind(this);
            this.componentDidMount = this.componentDidMount.bind(this);
            this.insertType = this.insertType.bind(this);
            this.changeGDValue = this.changeGDValue.bind(this);
            this.changeFDValue = this.changeFDValue.bind(this);
            this.setInputValue = this.setInputValue.bind(this);
            this.setChangeDate = this.setChangeDate.bind(this);
            this.componentDidUpdate = this.componentDidUpdate.bind(this);
            this.handleSearch = this.handleSearch.bind(this);
            this.render = this.render.bind(this);


            this.state = {
                fieldData: {},
                gridData: { rows: [], page: 1 },
                edit_type: 0,
                searchData: { keyword: null }
            }
        }
        static defaultProps: BaseDefine.GridFormPropsBase = {
            fdName: 'fieldData',
            gdName: 'searchData',
            apiPath: gb_approot + 'api/News'
        }
        componentDidMount() {
            this.queryGridData(1);
        }
        componentDidUpdate(prevProps, prevState) {
            if ((prevState.edit_type == 0 && (this.state.edit_type == 1 || this.state.edit_type == 2)) ||
                (prevState.edit_type == 1 && this.state.edit_type == 2)) {
                //console.log('CKEDITOR');
                CKEDITOR.replace('news_content');
            }
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
        handleSubmit(e: React.FormEvent) {

            e.preventDefault();
            this.state.fieldData.news_content = CKEDITOR.instances['news_content'].getData();
            if (this.state.edit_type == 1) {
                CommFunc.jqPost(this.props.apiPath, this.state.fieldData)
                    .done((data: FormResult, textStatus, jqXHRdata) => {
                        if (data.result) {
                            CommFunc.tosMessage(null, '新增完成', 1);
                            this.updateType(data.id);
                        } else {
                            alert(data.message);
                        }
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        CommFunc.showAjaxError(errorThrown);
                    });
            }
            else if (this.state.edit_type == 2) {
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
        handleOnBlur(date) {

        }
        deleteSubmit() {

            if (!confirm('確定是否刪除?')) {
                return;
            }

            var ids = [];
            for (var i in this.state.gridData.rows) {
                if (this.state.gridData.rows[i].check_del) {
                    ids.push('ids=' + this.state.gridData.rows[i].news_id);
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
        checkAll() {

            let newState = this.state;
            newState.checkAll = !newState.checkAll;
            for (var prop in this.state.gridData.rows) {
                this.state.gridData.rows[prop].check_del = newState.checkAll;
            }
            this.setState(newState);
        }
        insertType() {
            this.setState({
                edit_type: 1,
                fieldData: {
                    state: 'A',
                    set_date: Moment().format(dt.dateFT),
                    i_Lang: 'zh-TW'
                }
            });
        }
        updateType(id: number | string) {

            CommFunc.jqGet(this.props.apiPath, { id: id })
                .done((data, textStatus, jqXHRdata) => {
                    this.setState({ edit_type: 2, fieldData: data.data });
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    CommFunc.showAjaxError(errorThrown);
                });
        }
        noneType() {
            this.gridData(0)
                .done(function (data, textStatus, jqXHRdata) {
                    this.setState({ edit_type: 0, gridData: data });
                }.bind(this))
                .fail(function (jqXHR, textStatus, errorThrown) {
                    CommFunc.showAjaxError(errorThrown);
                });
        }

        changeFDValue(name: string, e: React.SyntheticEvent) {
            this.setInputValue(this.props.fdName, name, e);
        }
        changeGDValue(name: string, e: React.SyntheticEvent) {
            this.setInputValue(this.props.gdName, name, e);
        }
        setInputValue(collentName: string, name: string, e: React.SyntheticEvent) {
            let input: HTMLInputElement = e.target as HTMLInputElement;
            let obj = this.state[collentName];
            if (input.value == 'true') {
                obj[name] = true;
            } else if (input.value == 'false') {
                obj[name] = false;
            } else {
                obj[name] = input.value;
            }
            this.setState({ fieldData: obj });
        }

        setChangeDate(collentName: string, name: string, date: moment.Moment) {

            var v = date == null ? null : date.format();
            var objForUpdate = {
                [collentName]:
                {
                    [name]: {
                        $set: v
                    }
                }
            };
            var newState = update(this.state, objForUpdate);
            this.setState(newState);
        }
        render() {

            var outHtml: JSX.Element = <div></div>;

            if (this.state.edit_type == 0) {
                let searchData = this.state.searchData;
                let GridNavPage = CommCmpt.GridNavPage;

                outHtml =
                    (
                        <div>

                            <ul className="breadcrumb">
                                <li><i className="fa-list-alt"></i> {this.props.menuName}</li>
                            </ul>
                            <h3 className="title">
                                {this.props.caption}
                            </h3>
                            <form onSubmit={this.handleSearch}>
                                <div className="table-responsive">
                                    <div className="table-header">
                                        <div className="table-filter">
                                            <div className="form-inline">
                                                <div className="form-group">
                                                    <label>標題</label> { }
                                                    <input type="text" className="form-control"
                                                        onChange={this.changeGDValue.bind(this, 'keyword') }
                                                        value={searchData.keyword}
                                                        placeholder="請輸入關鍵字..." /> { }
                                                    <button className="btn-primary" type="submit"><i className="fa-search"></i> 搜尋</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th className="col-xs-1 text-center">
                                                    <label className="cbox">
                                                        <input type="checkbox" checked={this.state.checkAll} onChange={this.checkAll} />
                                                        <i className="fa-check"></i>
                                                    </label>
                                                </th>
                                                <th className="col-xs-1 text-center">修改</th>
                                                <th className="col-xs-3">標題</th>
                                                <th className="col-xs-3">日期</th>
                                                <th className="col-xs-2">語系</th>
                                                <th className="col-xs-2">狀態</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.gridData.rows.map(
                                                    (itemData, i) =>
                                                        <GridRow key={i}
                                                            ikey={i}
                                                            primKey={itemData.news_id}
                                                            itemData={itemData}
                                                            delCheck={this.delCheck}
                                                            updateType={this.updateType} />
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <GridNavPage
                                    startCount={this.state.gridData.startcount}
                                    endCount={this.state.gridData.endcount}
                                    recordCount={this.state.gridData.records}
                                    totalPage={this.state.gridData.total}
                                    nowPage={this.state.gridData.page}
                                    onQueryGridData={this.queryGridData}
                                    InsertType={this.insertType}
                                    deleteSubmit={this.deleteSubmit}
                                    />
                            </form>
                        </div>
                    );
            }
            else if (this.state.edit_type == 1 || this.state.edit_type == 2) {
                let fieldData = this.state.fieldData;
                let InputDate = CommCmpt.InputDate;

                let mnt_set_date = CommFunc.MntV(fieldData.set_date);

                outHtml = (
                    <div>
                        <ul className="breadcrumb">
                            <li><i className="fa-list-alt"></i>
                                {this.props.menuName}
                            </li>
                        </ul>
                        <h4 className="title"> {this.props.caption} 基本資料維護</h4>
                        <form className="form-horizontal" onSubmit={this.handleSubmit}>
                            <div className="col-xs-10">
                                <div className="form-group">
                                    <label className="col-xs-2 control-label">首頁列表圖</label>
                                    <div className="col-xs-8">
                                        <CommCmpt.MasterImageUpload FileKind="List" MainId={fieldData.news_id} ParentEditType={this.state.edit_type} url_upload={gb_approot + 'Active/NewsData/aj_FUpload'} url_list={gb_approot + 'Active/NewsData/aj_FList'}
                                            url_delete={gb_approot + 'Active/NewsData/aj_FDelete'} />
                                        <small className="help-block">最多1張圖，建議尺寸 180*180 px</small>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="col-xs-2 control-label">標題</label>
                                    <div className="col-xs-8">
                                        <input type="text" className="form-control" onChange={this.changeFDValue.bind(this, 'news_title') } value={fieldData.news_title} maxLength={64}
                                            required />
                                    </div>
                                    <small className="col-xs-2 text-danger">(必填) </small>
                                </div>

                                <div className="form-group">
                                    <label className="col-xs-2 control-label">日期</label>
                                    <div className="col-xs-8">
                                        <DatePicker selected={mnt_set_date}
                                            dateFormat={dt.dateFT}
                                            isClearable={true}
                                            required={true}
                                            locale="zh-TW"
                                            showYearDropdown
                                            onChange={this.setChangeDate.bind(this, this.props.fdName, 'set_date') }
                                            className="form-control" />
                                    </div>
                                    <small className="col-xs-2 text-danger">(必填) </small>
                                </div>

                                <div className="form-group">
                                    <label className="col-xs-2 control-label">狀態</label>
                                    <div className="col-xs-4">
                                        <select className="form-control"
                                            required
                                            value={fieldData.state}
                                            onChange={this.changeFDValue.bind(this, 'state') }>
                                            <option value="A">前台顯示</option>
                                            <option value="C">前台關閉</option>
                                        </select>
                                    </div>
                                </div>


                                <div className="form-group">
                                    <label className="col-xs-2 control-label">狀態</label>
                                    <div className="col-xs-4">
                                        <select className="form-control"
                                            required
                                            value={fieldData.i_Lang}
                                            onChange={this.changeFDValue.bind(this, 'i_Lang') }>
                                            <option value="zh-TW">繁體中文</option>
                                            <option value="zh-CN">簡體中文</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="col-xs-2 control-label">內容</label>
                                    <div className="col-xs-10">
                                        <textarea type="date" className="form-control" id="news_content" name="news_content" value={fieldData.news_content} onChange={this.changeFDValue.bind(this, 'news_content') } />
                                    </div>
                                </div>


                                <div className="form-action">
                                    <div className="col-xs-4 col-xs-offset-2">
                                        <button type="submit" className="btn-primary"><i className="fa-check"></i> 儲存</button>
                                        {}
                                        <button type="button" onClick={this.noneType}><i className="fa-times"></i> 回前頁</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                );
            }

            return outHtml;
        }
    }
}

var dom = document.getElementById('page_content');
ReactDOM.render(<News.GridForm caption={gb_caption} menuName={gb_menuname} iconClass="fa-list-alt" />, dom);