import * as React from 'react';
import { Log, FormDisplayMode } from '@microsoft/sp-core-library';
import {
  Breadcrumb, CommandBar, DatePicker, Dropdown, IBreadcrumbItem, ICommandBarItemProps,
  IDropdownOption, IPersonaProps, Label, MessageBar, MessageBarType,
  PrimaryButton, Separator, TextField, Toggle
} from '@fluentui/react';
import { Logger } from '@pnp/logging';
import { HttpRequestError } from '@pnp/odata';
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

import * as strings from 'FormBoilerplateFormCustomizerStrings';
import styles from './FormBoilerplate.module.scss';
import { ISPEmployeeItem } from 'models/ISPEmployeeItem';
import { Constants } from 'globals/Constants';
import IFormBoilerplateProps from 'models/IFormBoilerplateProps';

interface IFormBoilerplateState {
  formListItem: ISPEmployeeItem;
  error: string;
}

const LOG_SOURCE: string = 'FormBoilerplate';

export default class FormBoilerplate extends React.Component<IFormBoilerplateProps, IFormBoilerplateState> {

  private _completeByItems: IDropdownOption<string>[] =
    Object.keys(Constants.CompleteByChoices).map(value => { return { key: value, text: value } });

  constructor(props: IFormBoilerplateProps) {
    super(props);

    this.state = {
      formListItem: this.props.item,
      error: "",
    };
  }

  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: FormBoilerplate mounted');
  }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: FormBoilerplate unmounted');
  }

  public render(): React.ReactElement<{}> {
    let formTitle: string = strings.BreadCrumbLabelNewItem;

    if (this.props.displayMode !== FormDisplayMode.New) {
      formTitle = this.state.formListItem?.Title;
    }

    const breadcrumb: IBreadcrumbItem[] = [
      { text: this.props.context.list.title, key: 'ListTitle' },
      { text: formTitle, key: 'ItemTitle', isCurrentItem: true }
    ];

    const formDisabled: boolean = this.props.displayMode === FormDisplayMode.Display;

    const formContent: JSX.Element = (
      <div className={styles.helloForm}>
        <TextField
          autoComplete='off'
          required
          label={strings.FieldTitle}
          value={this.state.formListItem?.Title}
          onChange={this._onChangeTitle}
          disabled={formDisabled} />

        <Label>{strings.FieldDescription}</Label>
        <RichText
          value={this.state.formListItem?.Description}
          onChange={this._onChangeDescription}
          isEditMode={!formDisabled} />

        <Toggle
          label={strings.FieldComplete}
          checked={this.state.formListItem?.Complete}
          onChange={this._onChangeComplete}
          disabled={formDisabled} />

        <DatePicker
          label={strings.FieldCompletedon}
          value={this.state.formListItem?.Completedon}
          onSelectDate={this._onChangeCompleteOn}
          disabled={formDisabled} />

        <Dropdown
          label={strings.FieldCompleteby}
          selectedKey={this.state.formListItem?.Completeby}
          options={this._completeByItems}
          onChange={this._onChangeCompleteby}
          disabled={formDisabled} />

        <PeoplePicker
          context={this.props.context}
          ensureUser defaultSelectedUsers={[(this.state.formListItem?.Mentor)?.EMail]}
          titleText={strings.FieldMentor}
          personSelectionLimit={1}
          principalTypes={[PrincipalType.User]}
          onChange={this._onChangeMentor}
          disabled={formDisabled} />

        <TextField
          autoComplete='off'
          label={strings.FieldRelevantLink}
          placeholder={strings.RelevantLinkUrlPlaceholder}
          value={this.state.formListItem?.Relevantlink?.Url}
          onChange={this._onChangeRelevantLinkUrl}
          disabled={formDisabled} />

        <TextField
          autoComplete='off'
          placeholder={strings.RelevantLinkDescriptionPlaceholder}
          value={this.state.formListItem?.Relevantlink?.Description}
          onChange={this._onChangeRelevantLinkDescription}
          disabled={formDisabled} />
      </div>
    );

    return (
      <form onSubmit={this._onSubmitSaveItem} className={styles.formBoilerplate}>
        <CommandBar items={this._getCommandBarItems()} />
        <Separator className={styles.commandBarSeparators} />
        {this.state.error &&
          <MessageBar messageBarType={MessageBarType.error} onDismiss={() => { this.setState({ error: "" }) }}>{this.state.error}</MessageBar>
        }
        <Breadcrumb
          items={breadcrumb}
          className={styles.breadcrumbItem}
        />
        {formContent}
      </form>
    );
  }

  private _getCommandBarItems = (): ICommandBarItemProps[] => {
    const cancelCmd: ICommandBarItemProps = {
      key: 'cancelItem',
      text: strings.Cancel,
      iconProps: { iconName: 'Cancel' },
      onClick: () => this.props.onClose(),
      className: styles.commandBarItems
    };

    const newEditCmds: ICommandBarItemProps[] = [
      {
        key: 'saveItem',
        text: strings.Save,
        iconProps: { iconName: 'Save' },
        onRender: (item) => this._renderSaveButton(item)
      },
      cancelCmd
    ];

    const displayCmds: ICommandBarItemProps[] = [
      {
        key: 'EditItem',
        text: strings.Edit,
        iconProps: { iconName: 'Edit' },
        onClick: () => this._onClickEditItem(),
        className: styles.commandBarItems
      },
      cancelCmd
    ];

    return this.props.displayMode === FormDisplayMode.Display ? displayCmds : newEditCmds
  }

  private _onClickEditItem(): boolean | void {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("PageType")) {
      searchParams.set("PageType", FormDisplayMode.Edit.toString());
      window.location.href = location.protocol + "//" + location.host + location.pathname + "?" + searchParams;
    }
  }

  private _onChangeTitle = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    const form = this.state.formListItem;
    form.Title = newValue || '';

    this.setState({
      formListItem: form,
    });
  }

  private _onChangeDescription = (newValue: string): string => {
    const form = this.state.formListItem;
    form.Description = newValue || '';

    this.setState({
      formListItem: form,
    });

    return form.Description;
  }

  private _onChangeComplete = (_event: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean): void => {
    const form = this.state.formListItem;
    form.Complete = checked;

    this.setState({
      formListItem: form,
    });
  }

  private _onChangeCompleteOn = (date: Date): void => {
    const form = this.state.formListItem;
    form.Completedon = date;

    this.setState({
      formListItem: form,
    });
  }

  private _onChangeCompleteby = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<string>, _index?: number): void => {
    const form = this.state.formListItem;
    form.Completeby = option.text;

    this.setState({
      formListItem: form,
    });
  }

  private _onChangeMentor = (items: IPersonaProps[]): void => {
    const form = this.state.formListItem;
    form.Mentor = items.length > 0 && { Id: items[0].id, EMail: items[0].secondaryText } || null;

    this.setState({
      formListItem: form,
    });
  }

  private _onChangeRelevantLinkUrl = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    const form = this.state.formListItem;
    form.Relevantlink.Url = newValue || '';

    this.setState({
      formListItem: form,
    });
  }

  private _onChangeRelevantLinkDescription = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    const form = this.state.formListItem;
    form.Relevantlink.Description = newValue || '';

    this.setState({
      formListItem: form,
    });
  }

  private _renderSaveButton = (item: ICommandBarItemProps): React.ReactNode => {
    return (
      <PrimaryButton
        type="submit"
        className={styles.commandBarItems}
        styles={item.buttonStyles}
        text={item.text}
        iconProps={item.iconProps} />);
  }

  private _onSubmitSaveItem = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    this.setState({
      error: "",
    });

    try {
      await this.props.onSave({
        ...this.state.formListItem
      });
    } catch (err) {
      let updateError: string;

      if (err?.isHttpRequestError) {
        const httpErr: HttpRequestError = err as HttpRequestError;

        // Handling the concurrency issue as working with ETag
        if (httpErr.status === 412) {
          updateError = strings.ErrorEtagMessage;
        }
        else {
          updateError = (await httpErr.response.json())["odata.error"].message.value;
        }
      }
      else {
        updateError = err.message || err;
      }

      Logger.error(err);
      console.log(updateError);

      this.setState({
        error: updateError
      });
    }
  }
}