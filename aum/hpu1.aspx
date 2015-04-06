<%@ Page Title="" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="hpu1.aspx.cs" Inherits="hpu1" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="asp" %>


<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" Runat="Server">
<script type="text/javascript" src="~/Scripts/box.js" ></script>
<asp:Label ID="lbl" Text="" runat="server" Visible="false"></asp:Label>
<br />
<br />
<br />
<br />
<br />
<br />
<asp:Panel ID="pnl" runat="server" HorizontalAlign="Center">
<asp:Table runat="server" HorizontalAlign="Center" Width="50%">
<asp:TableRow>
<asp:TableCell ColumnSpan="3" HorizontalAlign="Center">
<asp:Image ID="carimage" runat="server" AlternateText="carimage"/>
</asp:TableCell>
</asp:TableRow>
<asp:TableRow>
<asp:TableCell Width="43%" HorizontalAlign="Right">
<asp:Button ID="btnsubmit" runat="server" Text="Submit" OnClick="Skip"/>
</asp:TableCell>
<asp:TableCell Width="13%" HorizontalAlign = "Center">
<asp:Button ID="btnskip" runat="server" Text="Skip" OnClick="Skip" />
</asp:TableCell>
<asp:TableCell Width="43%" HorizontalAlign = "Left">
<asp:Button ID="btndeletebox" runat="server" Text="Delete Box" OnClick="delete" />
</asp:TableCell>
</asp:TableRow>
</asp:Table>
</asp:Panel>
</asp:Content>

