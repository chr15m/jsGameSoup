<? include("website/header.php"); ?>
<? include_once("markdown.php"); ?>
<?= Markdown(file_get_contents("README.markdown")); ?>
<? include("website/footer.php"); ?>
