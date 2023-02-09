import * as React from "react";
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";
require("./richtext.css")

export interface ICustomRichTextProps {
    disabled: boolean;
    message: string;
    onChange: (text: string) => string;
}

export default class CustomRichText extends React.Component<ICustomRichTextProps, {}> {
    public render(): React.ReactElement<ICustomRichTextProps> {
        return <RichText isEditMode={!this.props.disabled} className="rich-text" value={this.props.message} onChange={this.props.onChange} />
    }
}