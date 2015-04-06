using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Diagnostics;

public partial class interface1 : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Session["interface"] = "true";
    }

    protected void start(object sender, EventArgs e)
    {
        Stopwatch sw = new Stopwatch();
        sw.Start();
        Session["timer"] = sw;
        Response.Redirect("~/hpu1.aspx");
    }
}