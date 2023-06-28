using System;
using System.Security.Cryptography.X509Certificates;

using Witsml.Data;

namespace Witsml;

public class WitsmlClientOptions
{
    /// <summary>
    /// Hostname of the WITSML server to connect to
    /// </summary>
    public string Hostname { get; init; }

    /// <summary>
    /// Client credentials to be used for basic authentication with the WITSML server
    /// </summary>
    public WitsmlCredentials Credentials { get; init; }

    /// <summary>
    /// Client certificate to present while connecting to the WITSML server. The certificate should contain the private key.
    /// </summary>
    public X509Certificate2 ClientCertificate { get; init; }

    /// <summary>
    /// The client capabilities to present to the WITSML server
    /// <see cref="WitsmlClientCapabilities" />
    /// </summary>
    public WitsmlClientCapabilities ClientCapabilities { get; init; } = new();

    /// <summary>
    /// The timeout interval to be used when communicating with the WITSML server. Default is 00:01:00 minutes
    /// </summary>
    public TimeSpan RequestTimeOut { get; init; } = TimeSpan.FromMinutes(1);

    /// <summary>
    /// Enable logging all queries to a file (queries.log) in the current directory
    /// </summary>
    public bool LogQueries { get; init; }
}

public record WitsmlCredentials(string Username, string Password);
