<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" doctype-system="about:legacy-compat" />
  <xsl:template match="/">
    <html><head><title>x3d img</title>
    <meta http-equiv='Content-Type' content='text/html;charset=utf-8'></meta>
    <link rel='stylesheet' type='text/css' href='http://www.x3dom.org/x3dom/release/x3dom.css'></link>
    <script type='text/javascript' src='http://www.x3dom.org/x3dom/release/x3dom.js'></script>
    </head><body><xsl:apply-templates/>
    <!-- identity transform -->
    </body></html>
  </xsl:template>
  <!--<xsl:for-each select="Scene">
    <div></div>
  </xsl:for-each>-->
      <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
    </xsl:template>
</xsl:stylesheet>
