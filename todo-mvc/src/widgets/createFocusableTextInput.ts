import WeakMap from 'dojo-shim/WeakMap';
import createFormFieldMixin, { FormFieldMixin, FormFieldMixinOptions, FormFieldMixinState } from 'dojo-widgets/mixins/createFormFieldMixin';
import createRenderMixin, { RenderMixin, RenderMixinOptions, RenderMixinState } from 'dojo-widgets/mixins/createRenderMixin';
import createVNodeEvented, { VNodeEvented } from 'dojo-widgets/mixins/createVNodeEvented';
import { VNodeProperties } from 'maquette';

/* I suspect this needs to go somewhere else */
export interface TypedTargetEvent<T extends EventTarget> extends Event {
	target: T;
}

export type FocusableTextInputState = RenderMixinState & FormFieldMixinState<string> & {
	focused?: boolean;
	placeholder?: string;
};

/* TODO: label should probably be baked into FormFieldMixin. There's currently a label attribute in state, so we should consider re-naming one of them */
export type FocusableTextInputOptions = RenderMixinOptions<FocusableTextInputState> & FormFieldMixinOptions<string, FocusableTextInputState> & {
	label?: string;
};

export type FocusableTextInput = RenderMixin<FocusableTextInputState> & FormFieldMixin<string, FocusableTextInputState> & VNodeEvented & {
	label?: string
};

const afterUpdateFunctions = new WeakMap<FocusableTextInput, {(element: HTMLInputElement): void}>();

/* afterUpdate is a Maquette JS callback when it thinks the node "may have been updated" */
function afterUpdate(instance: FocusableTextInput, element: HTMLInputElement) {
	const focused: boolean = instance.state.focused;
	if (focused) {
		element.focus();
	}
	else if (!focused && document.activeElement === element) {
		element.blur();
	}
}

const createFocusableTextInput = createRenderMixin
	.mixin(createFormFieldMixin)
	.mixin({
		mixin: createVNodeEvented,
		initialize(instance: any, { label }: FocusableTextInputOptions) {
			instance.own(instance.on('input', (event: TypedTargetEvent<HTMLInputElement>) => {
				instance.value = event.target.value;
			}));
			afterUpdateFunctions.set(instance, (element: HTMLInputElement) => afterUpdate(instance, element));
			if (label) {
				instance.label = label;
			}
		}
	})
	.extend({
		nodeAttributes: [
			function (this: FocusableTextInput): VNodeProperties {
				const afterUpdate = afterUpdateFunctions.get(this);
				const { placeholder } = this.state;
				return { afterCreate: afterUpdate, afterUpdate, placeholder, 'aria-label': this.label };
			}
		],

		tagName: 'input',

		type: 'text'
	});

export default createFocusableTextInput;
