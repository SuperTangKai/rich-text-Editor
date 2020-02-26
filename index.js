<template>
	<div class="wrap">
		<quill-editor
			v-model="content"
			style="line-height:22px"
			ref="myQuillEditor"
			:options="editorOption"
			@blur="onEditorBlur($event)"
			@change="onEditorChange($event)"
		>
		</quill-editor>
		<el-upload
			style="display:none"
			action=""
			:http-request="upload"
			:on-success="handleSuccess"
		>
			<el-button size="small" type="primary" plain icon="el-icon-upload2"
				>上传附件</el-button
			>
		</el-upload>
	</div>
</template>
<script>
// import { noticeUpload } from '@/api/notice/notice'

export default {
	name: 'editor',
	props: ['url', 'value'],
	data() {
		const toolbarOptions = [
			['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
			['blockquote', 'code-block'], //引用，代码块
			[{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
			[{ list: 'ordered' }, { list: 'bullet' }], //列表
			[{ script: 'sub' }, { script: 'super' }], // 上下标
			[{ indent: '-1' }, { indent: '+1' }], // 缩进
			[{ direction: 'rtl' }], // 文本方向
			[{ size: ['small', false, 'large', 'huge'] }], // 字体大小
			[{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题
			[{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
			[{ font: [] }], //字体
			[{ align: [] }], //对齐方式
			['clean'], //清除字体样式
			['image'] //上传图片、上传视频
		];
		return {
			content: this.value,
			editorOption: {
				modules: {
					toolbar: {
						container: toolbarOptions,
						handlers: {
							image: function(value) {
								if (value) {
									document
										.querySelector('.el-upload .el-button')
										.click();
								} else {
									this.quill.format('image', false);
								}
							}
						}
					}
				},
				placeholder: '请输入内容'
			}
		};
	},
	watch: {
		value(val) {
			this.content = val;
		}
	},
	mounted() {
		const titleConfig = {
			'ql-bold': '加粗',
			'ql-color': '颜色',
			'ql-font': '字体',
			'ql-code': '插入代码',
			'ql-italic': '斜体',
			'ql-link': '添加链接',
			'ql-background': '背景颜色',
			'ql-size': '字体大小',
			'ql-strike': '删除线',
			'ql-script': '上标/下标',
			'ql-underline': '下划线',
			'ql-blockquote': '引用',
			'ql-header': '标题',
			'ql-indent': '缩进',
			'ql-list': '列表',
			'ql-align': '文本对齐',
			'ql-direction': '文本方向',
			'ql-code-block': '代码块',
			'ql-formula': '公式',
			'ql-image': '图片',
			'ql-video': '视频',
			'ql-clean': '清除字体样式',
			'ql-upload': '文件'
		};
		const oToolBar = document.querySelector('.ql-toolbar'),
			aButton = oToolBar.querySelectorAll('button'),
			aSelect = oToolBar.querySelectorAll('select');
		aButton.forEach(function(item) {
			if (item.className === 'ql-script') {
				item.value === 'sub'
					? (item.title = '下标')
					: (item.title = '上标');
			} else if (item.className === 'ql-indent') {
				item.value === '+1'
					? (item.title = '向右缩进')
					: (item.title = '向左缩进');
			} else {
				item.title = titleConfig[item.classList[0]];
			}
		});
		aSelect.forEach(function(item) {
			item.parentNode.title = titleConfig[item.classList[0]];
		});
	},
	methods: {
		// 覆盖插件上传
		upload(item) {
			let formData = new FormData();
			formData.append('file', item.file);
			// noticeUpload({data:formData}).then(res=>{
			//     this.handleSuccess(res)
			// })
		},
		handleSuccess(res) {
			// 获取富文本组件实例
			let quill = this.$refs.myQuillEditor.quill;
			// 如果上传成功
			if (res) {
				// 获取光标所在位置
				let length = quill.getSelection().index;
				// 插入图片，res为服务器返回的图片链接地址
				quill.insertEmbed(length, 'image', res.data);
				// 调整光标到最后
				quill.setSelection(length + 1);
			} else {
				this.$message.error('图片插入失败');
			}
		},
		// 失焦
		onEditorBlur() {
			this.$emit('blur');
		},
		// 内容变化
		onEditorChange() {
			this.$emit('change', this.content);
		}
	}
};
</script>
<style scoped lang="less">
/deep/.ql-container {
	height: 300px;
}
</style>
