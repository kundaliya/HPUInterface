<%@ Page Title="Team BitsOfVision" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="interface1.aspx.cs" Inherits="interface1" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" Runat="Server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" Runat="Server">
<h2>
HPU Interface 1
</h2>
<h3>
Instructions:
</h3>
<p>
<asp:BulletedList runat="server">
    <asp:ListItem>The task is to recognize a car in the given image.</asp:ListItem>
    <asp:ListItem>If you find more than one car, please mark the most clearly visible complete car.</asp:ListItem>
    <asp:ListItem>To create a box around a car, drag your mouse over the car.</asp:ListItem>
    <asp:ListItem>To delete a box, start drawing a new box. Older box would automatically be deleted.</asp:ListItem>
</asp:BulletedList>
<br />
<asp:Button runat="server" ID="btn" Text="click here to start" OnClick= "start" />
</p>
</asp:Content>

