import createRenderMixin, { RenderMixin, RenderMixinState } from 'dojo-widgets/mixins/createRenderMixin';
import createVNodeEvented, { VNodeEvented } from 'dojo-widgets/mixins/createVNodeEvented';
import { VNodeProperties } from 'maquette';

export type TodoLabel = RenderMixin<RenderMixinState> & VNodeEvented;

/* TODO: add easy way of adding aria roles and properties (similar to VNodeEvented's listeners) */
const createTodoLabel = createRenderMixin
	.mixin(createVNodeEvented)
	.extend({
		tagName: 'label',
		nodeAttributes: [
			function (this: TodoLabel): VNodeProperties {
				return {
					'aria-describedby': 'edit-instructions',
					tabindex: '0'
				};
			}
		]
	});

export default createTodoLabel;
