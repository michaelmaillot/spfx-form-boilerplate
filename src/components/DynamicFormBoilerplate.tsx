import * as React from 'react';
import { DynamicForm } from '@pnp/spfx-controls-react/lib/controls/dynamicForm/DynamicForm';
import { ISPEmployeeItem } from 'models/ISPEmployeeItem';
import { ITheme, MessageBar, MessageBarType } from '@fluentui/react';
import { FormDisplayMode } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';
import { HttpRequestError } from '@pnp/odata';
import { Logger } from '@pnp/logging';

// import styles from './DynamicFormBoilerplate.module.scss';

export interface IDynamicFormBoilerplateProps {
  context: FormCustomizerContext;
  displayMode: FormDisplayMode;
  theme: ITheme;
  item: ISPEmployeeItem;
  onSave: (updatedItem: ISPEmployeeItem) => void;
  onClose: () => void;
}

interface IDynamicFormBoilerplateState {
  error: string;
}

export default class DynamicFormBoilerplate extends React.Component<IDynamicFormBoilerplateProps, IDynamicFormBoilerplateState> {

  constructor(props: IDynamicFormBoilerplateProps) {
    super(props);

    this.state = {
      error: "",
    };
  }

  public render(): React.ReactElement<IDynamicFormBoilerplateProps> {
    return (
      <div>
        {this.state.error &&
          <MessageBar messageBarType={MessageBarType.error} onDismiss={() => { this.setState({ error: "" }) }}>{this.state.error}</MessageBar>
        }
        <DynamicForm
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          context={this.props.context as any}
          listId={this.props.context.list.guid.toString()}
          listItemId={this.props.context.itemId}
          onSubmitted={this.props.onSave}
          onCancelled={this.props.onClose}
          onSubmitError={this._handleSPError}
          disabled={this.props.displayMode === FormDisplayMode.Display} />
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _handleSPError = async (listItemData: any, error: any): Promise<void> => {
    let updateError: string;

    if (error?.isHttpRequestError) {
      const httpErr: HttpRequestError = error as HttpRequestError;

      updateError = (await httpErr.response.json())["odata.error"].message.value;
    }
    else {
      updateError = error.message || error;
    }

    Logger.error(error);
    console.log(updateError);

    this.setState({
      error: updateError
    });
  }
}
