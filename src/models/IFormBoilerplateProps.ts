import { ITheme } from "@fluentui/react";
import { FormDisplayMode } from "@microsoft/sp-core-library";
import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import { ISPEmployeeItem } from "./ISPEmployeeItem";

export default interface IFormBoilerplateProps {
    context: FormCustomizerContext;
    displayMode: FormDisplayMode;
    theme: ITheme;
    item: ISPEmployeeItem;
    onSave: (updatedItem: ISPEmployeeItem) => void;
    onClose: () => void;
}