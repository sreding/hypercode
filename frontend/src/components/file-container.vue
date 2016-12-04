<template>
  <div id="file-container">
    <textarea name="code" id="code"></textarea>
  </div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/mode/clike/clike';

export default {
  name: 'file-container',
  mounted: function () {
    this.cm = CodeMirror.fromTextArea(this.$el.querySelector('#code'), {
      lineNumbers: true,
      mode: 'text/x-java',
    });
    this.cm.setSize(this.width, this.height);
  },
  props: {
    'width': { default: 400 },
    'height': { default: 400 },
  },
  data: function () {
    return {
      cm: null,
      title: '',
    };
  }
}
</script>

<style src="codemirror/lib/codemirror.css"></style>